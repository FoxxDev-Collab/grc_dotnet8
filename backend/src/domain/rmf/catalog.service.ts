import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, QueryOrder } from '@mikro-orm/core';
import { Catalog } from '../../entities/catalog.entity';
import { Group } from '../../entities/group.entity';
import { Control } from '../../entities/control.entity';
import { Parameter } from '../../entities/parameter.entity';
import { Part } from '../../entities/part.entity';
import { ControlLink } from '../../entities/control-link.entity';
import { PaginationDto } from './dto/catalog.dto';
import * as fs from 'fs';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Validation schemas remain the same...
const ParameterSchema = z.object({
  id: z.string(),
  label: z.string().optional().default('')
});

const PartSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  prose: z.string().optional(),
  parts: z.array(z.lazy(() => PartSchema)).optional()
}).transform(part => ({
  ...part,
  id: part.id || uuidv4()
}));

const LinkSchema = z.object({
  href: z.string(),
  rel: z.string()
});

const EnhancementSchema = z.object({
  id: z.string(),
  class: z.literal('SP800-53-enhancement'),
  title: z.string(),
  params: z.array(ParameterSchema).optional(),
  parts: z.array(PartSchema).optional(),
  links: z.array(LinkSchema).optional()
});

const ControlSchema = z.object({
  id: z.string(),
  class: z.string(),
  title: z.string(),
  params: z.array(ParameterSchema).optional(),
  parts: z.array(PartSchema).optional(),
  controls: z.array(EnhancementSchema).optional(),
  links: z.array(LinkSchema).optional()
});

const GroupSchema = z.object({
  id: z.string(),
  class: z.string(),
  title: z.string(),
  controls: z.array(ControlSchema)
});

const CatalogSchema = z.object({
  catalog: z.object({
    uuid: z.string(),
    metadata: z.object({
      title: z.string(),
      version: z.string(),
      'last-modified': z.string()
    }),
    groups: z.array(GroupSchema)
  })
});

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);

  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<Catalog[]> {
    this.logger.log('Finding all catalogs with basic info');
    try {
      const catalogs = await this.em.find(Catalog, {}, { 
        populate: ['groups'] 
      });
      
      const catalogSummary = catalogs.map(catalog => ({
        id: catalog.id,
        title: catalog.title,
        groupCount: catalog.groups.count()
      }));
      
      this.logger.log(`Found ${catalogs.length} catalogs. Summary: ${JSON.stringify(catalogSummary, null, 2)}`);
      return catalogs;
    } catch (error) {
      this.logger.error(`Error finding catalogs: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findCatalogBasic(id: string): Promise<Catalog | null> {
    this.logger.log(`Finding basic catalog info with id: ${id}`);
    try {
      const catalog = await this.em.findOne(Catalog, { id }, { 
        populate: ['groups'] 
      });
      
      if (catalog) {
        const groupCount = catalog.groups.count();
        this.logger.log(
          `Found catalog: ${catalog.title} (${catalog.version}) ` +
          `with ${groupCount} groups`
        );
      } else {
        this.logger.warn(`No catalog found with id: ${id}`);
      }
      
      return catalog;
    } catch (error) {
      this.logger.error(`Error finding catalog ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findGroup(groupId: string): Promise<Group | null> {
    this.logger.log(`Finding group with id: ${groupId}`);
    try {
      const group = await this.em.findOne(Group, { id: groupId }, { 
        populate: ['controls'] 
      });
      
      if (group) {
        this.logger.log(
          `Found group: ${group.title} with ${group.controls.count()} controls`
        );
      } else {
        this.logger.warn(`No group found with id: ${groupId}`);
      }
      
      return group;
    } catch (error) {
      this.logger.error(`Error finding group ${groupId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findCatalogWithPagination(id: string, pagination: PaginationDto) {
    this.logger.log(`Finding catalog with pagination, id: ${id}, page: ${pagination.page}, limit: ${pagination.limit}`);
    try {
      const catalog = await this.em.findOne(Catalog, { id });
      if (!catalog) {
        return { catalog: null, totalGroups: 0, hasMore: false };
      }

      // Get total count of groups
      const totalGroups = await this.em.count(Group, { catalog });

      // Calculate offset
      const offset = (pagination.page - 1) * pagination.limit;

      // Load groups with pagination
      const groups = await this.em.find(Group, { catalog }, {
        orderBy: { title: QueryOrder.ASC },
        limit: pagination.limit,
        offset: offset
      });

      // Manually set the groups collection
      catalog.groups.set(groups);

      // Load basic control information for each group
      for (const group of groups) {
        const controls = await this.em.find(Control, { group });
        const controlRefs = controls.map(control => this.em.getReference(Control, control.id));
        group.controls.set(controlRefs);
      }

      const hasMore = offset + pagination.limit < totalGroups;

      this.logger.log(
        `Found catalog: ${catalog.title} (${catalog.version})\n` +
        `Page ${pagination.page}: ${groups.length} groups\n` +
        `Total groups: ${totalGroups}\n` +
        `Has more: ${hasMore}`
      );

      return { catalog, totalGroups, hasMore };
    } catch (error) {
      this.logger.error(`Error finding catalog ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findGroupWithPagination(groupId: string, pagination: PaginationDto) {
    this.logger.log(`Finding group with pagination, id: ${groupId}, page: ${pagination.page}, limit: ${pagination.limit}`);
    try {
      const group = await this.em.findOne(Group, { id: groupId });
      if (!group) {
        return { group: null, totalControls: 0, hasMore: false };
      }

      // Get total count of controls
      const totalControls = await this.em.count(Control, { group });

      // Calculate offset
      const offset = (pagination.page - 1) * pagination.limit;

      // Load controls with pagination
      const controls = await this.em.find(Control, { group }, {
        orderBy: { id: QueryOrder.ASC },
        limit: pagination.limit,
        offset: offset
      });

      // Convert to references and set the collection
      const controlRefs = controls.map(control => this.em.getReference(Control, control.id));
      group.controls.set(controlRefs);

      const hasMore = offset + pagination.limit < totalControls;

      this.logger.log(
        `Found group: ${group.title}\n` +
        `Page ${pagination.page}: ${controls.length} controls\n` +
        `Total controls: ${totalControls}\n` +
        `Has more: ${hasMore}`
      );

      return { group, totalControls, hasMore };
    } catch (error) {
      this.logger.error(`Error finding group ${groupId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findControl(controlId: string): Promise<Control | null> {
    this.logger.log(`Finding control with id: ${controlId}`);
    try {
      const control = await this.em.findOne(Control, { id: controlId }, { 
        populate: [
          'parts',
          'parameters',
          'enhancements',
          'enhancements.parts',
          'enhancements.parameters',
          'outgoingLinks',
          'outgoingLinks.targetControl',
          'incomingLinks',
          'incomingLinks.sourceControl'
        ] 
      });
      
      if (control) {
        this.logger.log(
          `Found control: ${control.title} with ` +
          `${control.parts.count()} parts, ${control.parameters.count()} parameters, ` +
          `${control.enhancements?.count() || 0} enhancements, ` +
          `${control.outgoingLinks?.count() || 0} outgoing links, and ` +
          `${control.incomingLinks?.count() || 0} incoming links`
        );
      } else {
        this.logger.warn(`No control found with id: ${controlId}`);
      }
      
      return control;
    } catch (error) {
      this.logger.error(`Error finding control ${controlId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findCatalogWithFullHierarchy(id: string): Promise<Catalog | null> {
    this.logger.log(`Finding catalog with full hierarchy, id: ${id}`);
    try {
      const catalog = await this.em.findOne(Catalog, { id }, { 
        populate: [
          'groups',
          'groups.controls',
          'groups.controls.parts',
          'groups.controls.parameters',
          'groups.controls.enhancements',
          'groups.controls.enhancements.parts',
          'groups.controls.enhancements.parameters',
          'groups.controls.outgoingLinks',
          'groups.controls.outgoingLinks.targetControl',
          'groups.controls.incomingLinks',
          'groups.controls.incomingLinks.sourceControl'
        ]
      });
      
      if (catalog) {
        const groupCount = catalog.groups.count();
        const controlCount = catalog.groups.getItems().reduce(
          (sum, group) => sum + group.controls.count(), 
          0
        );
        this.logger.log(
          `Found catalog: ${catalog.title} (${catalog.version}) ` +
          `with ${groupCount} groups and ${controlCount} controls`
        );

        // Log detailed information about the first control to verify data
        const firstGroup = catalog.groups.getItems()[0];
        if (firstGroup) {
          const firstControl = firstGroup.controls.getItems()[0];
          if (firstControl) {
            this.logger.debug(
              `Sample control ${firstControl.id}:\n` +
              `- Parts: ${firstControl.parts.isInitialized() ? firstControl.parts.count() : 'not initialized'}\n` +
              `- Parameters: ${firstControl.parameters.isInitialized() ? firstControl.parameters.count() : 'not initialized'}\n` +
              `- Enhancements: ${firstControl.enhancements?.isInitialized() ? firstControl.enhancements.count() : 'not initialized'}\n` +
              `- OutgoingLinks: ${firstControl.outgoingLinks?.isInitialized() ? firstControl.outgoingLinks.count() : 'not initialized'}\n` +
              `- IncomingLinks: ${firstControl.incomingLinks?.isInitialized() ? firstControl.incomingLinks.count() : 'not initialized'}`
            );
          }
        }
      } else {
        this.logger.warn(`No catalog found with id: ${id}`);
      }
      
      return catalog;
    } catch (error) {
      this.logger.error(`Error finding catalog ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getRelatedControls(controlId: string): Promise<Control[]> {
    this.logger.log(`Finding related controls for control: ${controlId}`);
    try {
      const links = await this.em.find(ControlLink, {
        $or: [
          { sourceControl: controlId, rel: 'related' },
          { targetControl: controlId, rel: 'related' },
        ],
      }, {
        populate: ['sourceControl', 'targetControl'],
      });

      const relatedControls = new Set<Control>();
      
      for (const link of links) {
        if (link.sourceControl.id === controlId) {
          relatedControls.add(link.targetControl);
        } else {
          relatedControls.add(link.sourceControl);
        }
      }

      this.logger.log(`Found ${relatedControls.size} related controls for ${controlId}`);
      return Array.from(relatedControls);
    } catch (error) {
      this.logger.error(`Error finding related controls for ${controlId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // importCatalog method remains the same...
  async importCatalog(filePath: string) {
    this.logger.log(`Importing catalog from file: ${filePath}`);
    const startTime = Date.now();

    try {
      // Read and validate OSCAL JSON file
      const rawData = fs.readFileSync(filePath, 'utf8');
      const parsedData = JSON.parse(rawData);
      const validatedData = CatalogSchema.parse(parsedData);

      const em = this.em.fork();
      const controlMap = new Map<string, Control>();

      // Create catalog
      const catalog = new Catalog(
        validatedData.catalog.uuid,
        validatedData.catalog.metadata.title,
        validatedData.catalog.metadata.version,
        new Date(validatedData.catalog.metadata['last-modified'])
      );
      await em.persistAndFlush(catalog);

      // Process groups and their controls
      const stats = {
        groups: 0,
        controls: 0,
        parts: 0,
        parameters: 0,
        enhancements: 0,
        links: 0
      };

      // First pass: Create all controls and store them in the map
      for (const groupData of validatedData.catalog.groups) {
        const group = new Group(
          groupData.id,
          groupData.title,
          groupData.class,
          catalog
        );
        em.persist(group);
        stats.groups++;

        for (const controlData of groupData.controls) {
          const control = new Control(
            controlData.id,
            controlData.title,
            controlData.class,
            group
          );
          em.persist(control);
          controlMap.set(controlData.id, control);
          stats.controls++;

          // Store enhancements in the map as well
          if (controlData.controls) {
            for (const enhancementData of controlData.controls) {
              const enhancement = new Control(
                enhancementData.id,
                enhancementData.title,
                enhancementData.class,
                group,
                control
              );
              em.persist(enhancement);
              controlMap.set(enhancementData.id, enhancement);
              stats.enhancements++;
            }
          }
        }
      }

      // Second pass: Process all controls with their components
      for (const groupData of validatedData.catalog.groups) {
        for (const controlData of groupData.controls) {
          const control = controlMap.get(controlData.id);
          if (!control) continue;

          // Process parameters
          if (controlData.params) {
            for (const paramData of controlData.params) {
              const parameter = new Parameter(
                paramData.id,
                paramData.label || '',
                control
              );
              em.persist(parameter);
              stats.parameters++;
            }
          }

          // Process parts
          if (controlData.parts) {
            await this.processPartsRecursively(controlData.parts, control, em, stats);
          }

          // Process links
          if (controlData.links) {
            await this.processControlLinks(controlData.links, control, em, controlMap, stats);
          }

          // Process enhancements
          if (controlData.controls) {
            for (const enhancementData of controlData.controls) {
              const enhancement = controlMap.get(enhancementData.id);
              if (!enhancement) continue;

              if (enhancementData.params) {
                for (const paramData of enhancementData.params) {
                  const parameter = new Parameter(
                    paramData.id,
                    paramData.label || '',
                    enhancement
                  );
                  em.persist(parameter);
                  stats.parameters++;
                }
              }

              if (enhancementData.parts) {
                await this.processPartsRecursively(enhancementData.parts, enhancement, em, stats);
              }

              if (enhancementData.links) {
                await this.processControlLinks(enhancementData.links, enhancement, em, controlMap, stats);
              }
            }
          }
        }

        // Flush after each group to avoid memory issues
        await em.flush();
      }

      const duration = Date.now() - startTime;
      const result = {
        success: true,
        duration,
        stats,
        catalog: {
          id: catalog.id,
          title: catalog.title,
          version: catalog.version
        }
      };

      this.logger.log(`Successfully imported catalog in ${duration}ms. Stats: ${JSON.stringify(stats, null, 2)}`);
      return result;

    } catch (error) {
      if (error instanceof z.ZodError) {
        this.logger.error('OSCAL validation failed:', error.errors);
        throw new Error('Invalid OSCAL format');
      }
      
      this.logger.error(`Error importing catalog: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async processPartsRecursively(
    parts: z.infer<typeof PartSchema>[],
    control: Control,
    em: EntityManager,
    stats: { parts: number },
    parentPart?: Part
  ) {
    for (const partData of parts) {
      const part = new Part(
        partData.id,
        partData.name,
        partData.prose || '',
        control,
        parentPart
      );
      em.persist(part);
      stats.parts++;

      if (partData.parts) {
        await this.processPartsRecursively(partData.parts, control, em, stats, part);
      }
    }
  }

  private async processControlLinks(
    links: z.infer<typeof LinkSchema>[],
    sourceControl: Control,
    em: EntityManager,
    controlMap: Map<string, Control>,
    stats: { links: number }
  ) {
    for (const linkData of links) {
      // Extract control ID from href (remove '#' prefix)
      const targetId = linkData.href.startsWith('#') ? linkData.href.substring(1) : linkData.href;
      
      // For control-to-control relationships (like "related" or "incorporated-into")
      if (targetId.match(/^[a-z]{2}-\d+(\.\d+)?$/i)) {
        const targetControl = controlMap.get(targetId);
        if (targetControl) {
          const link = new ControlLink(
            uuidv4(),
            sourceControl,
            targetControl,
            linkData.rel,
            linkData.href
          );
          em.persist(link);
          stats.links++;
        }
      }
      // For other reference links (like external references)
      else {
        const link = new ControlLink(
          uuidv4(),
          sourceControl,
          sourceControl, // Self-reference for non-control links
          linkData.rel,
          linkData.href
        );
        em.persist(link);
        stats.links++;
      }
    }
  }
}
