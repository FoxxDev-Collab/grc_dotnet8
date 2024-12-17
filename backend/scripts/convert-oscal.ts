import { MikroORM, EntityManager } from '@mikro-orm/core';
import * as fs from 'fs';
import { z } from 'zod';
import mikroOrmConfig from '../mikro-orm.config';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Catalog } from '../src/entities/catalog.entity';
import { Group } from '../src/entities/group.entity';
import { Control } from '../src/entities/control.entity';
import { Parameter } from '../src/entities/parameter.entity';
import { Part } from '../src/entities/part.entity';
import { ControlLink } from '../src/entities/control-link.entity';

// Validation schemas
const ParameterSchema = z.object({
  id: z.string(),
  label: z.string().optional().default('') // Make label optional with default empty string
});

const PartSchema = z.object({
  id: z.string().optional(),  // Make id optional
  name: z.string(),
  prose: z.string().optional(),
  parts: z.array(z.lazy(() => PartSchema)).optional()
}).transform(part => ({
  ...part,
  id: part.id || uuidv4() // Generate UUID if id is missing
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

class ImportProgress {
  private totalGroups: number = 0;
  private processedGroups: number = 0;
  private totalControls: number = 0;
  private processedControls: number = 0;
  private errors: Array<{ type: string; message: string; details?: any }> = [];
  private startTime: Date;
  private lastProgressUpdate: Date;

  constructor(totalGroups: number, totalControls: number) {
    this.totalGroups = totalGroups;
    this.totalControls = totalControls;
    this.startTime = new Date();
    this.lastProgressUpdate = new Date();
  }

  incrementGroup() {
    this.processedGroups++;
    this.logProgress();
  }

  incrementControl() {
    this.processedControls++;
    if (this.shouldLogProgress()) {
      this.logProgress();
    }
  }

  addError(type: string, message: string, details?: any) {
    this.errors.push({ type, message, details });
    console.error(`Error - ${type}: ${message}`);
    if (details) {
      console.error('Details:', details);
    }
  }

  private shouldLogProgress(): boolean {
    const now = new Date();
    const timeSinceLastUpdate = now.getTime() - this.lastProgressUpdate.getTime();
    // Only update progress every 2 seconds to avoid console spam
    return timeSinceLastUpdate > 2000;
  }

  private logProgress() {
    const now = new Date();
    const elapsedSeconds = (now.getTime() - this.startTime.getTime()) / 1000;
    const controlsPerSecond = this.processedControls / elapsedSeconds;
    
    console.log(
      `Progress: ${this.processedGroups}/${this.totalGroups} groups, ` +
      `${this.processedControls}/${this.totalControls} controls ` +
      `(${controlsPerSecond.toFixed(2)} controls/sec)`
    );
    
    this.lastProgressUpdate = now;
  }

  getReport() {
    const endTime = new Date();
    const totalSeconds = (endTime.getTime() - this.startTime.getTime()) / 1000;

    return {
      completed: {
        groups: this.processedGroups,
        controls: this.processedControls
      },
      total: {
        groups: this.totalGroups,
        controls: this.totalControls
      },
      timing: {
        totalSeconds,
        controlsPerSecond: this.processedControls / totalSeconds
      },
      success: this.errors.length === 0,
      errors: this.errors
    };
  }
}

const BATCH_SIZE = 50; // Process 50 controls at a time

async function processControlLinks(
  controlData: z.infer<typeof ControlSchema>,
  control: Control,
  em: EntityManager,
  progress: ImportProgress,
  controlMap: Map<string, Control>
) {
  if (controlData.links) {
    for (const linkData of controlData.links) {
      try {
        // Extract control ID from href (remove '#' prefix)
        const targetId = linkData.href.startsWith('#') ? linkData.href.substring(1) : linkData.href;
        
        // For control-to-control relationships (like "related" or "incorporated-into")
        if (targetId.match(/^[a-z]{2}-\d+(\.\d+)?$/i)) {
          const targetControl = controlMap.get(targetId);
          if (targetControl) {
            const link = new ControlLink(
              uuidv4(),
              control,
              targetControl,
              linkData.rel,
              linkData.href
            );
            em.persist(link);
          }
        }
        // For other reference links (like external references)
        else {
          const link = new ControlLink(
            uuidv4(),
            control,
            control, // Self-reference for non-control links
            linkData.rel,
            linkData.href
          );
          em.persist(link);
        }
      } catch (error) {
        progress.addError('link', `Failed to process link ${linkData.href} for control ${controlData.id}`, error);
      }
    }
  }
}

async function importOSCAL(orm: MikroORM, filePath: string) {
  const em = orm.em.fork();
  let progress: ImportProgress;
  // Map to store controls by ID for link processing
  const controlMap = new Map<string, Control>();

  try {
    // Read and validate OSCAL JSON file
    console.log('Reading OSCAL file...');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(rawData);
    
    // Validate against schema
    console.log('Validating OSCAL structure...');
    const validatedData = CatalogSchema.parse(parsedData);
    
    // Calculate total controls including enhancements
    const totalGroups = validatedData.catalog.groups.length;
    const totalControls = validatedData.catalog.groups.reduce(
      (sum, group) => sum + group.controls.reduce(
        (groupSum, control) => groupSum + 1 + (control.controls?.length || 0),
        0
      ),
      0
    );
    progress = new ImportProgress(totalGroups, totalControls);

    // Create catalog outside of group processing
    console.log('Creating catalog...');
    const catalog = new Catalog(
      validatedData.catalog.uuid,
      validatedData.catalog.metadata.title,
      validatedData.catalog.metadata.version,
      new Date(validatedData.catalog.metadata['last-modified'])
    );
    await em.persistAndFlush(catalog);

    // First pass: Create all controls and store them in the map
    for (const groupData of validatedData.catalog.groups) {
      const group = new Group(
        groupData.id,
        groupData.title,
        groupData.class,
        catalog
      );
      em.persist(group);

      for (const controlData of groupData.controls) {
        const control = new Control(
          controlData.id,
          controlData.title,
          controlData.class,
          group
        );
        em.persist(control);
        controlMap.set(controlData.id, control);

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
          }
        }
      }
    }

    // Second pass: Process all controls with their links
    for (const groupData of validatedData.catalog.groups) {
      try {
        await em.transactional(async (em) => {
          // Process controls in batches
          const controls = groupData.controls;
          for (let i = 0; i < controls.length; i += BATCH_SIZE) {
            const batch = controls.slice(i, i + BATCH_SIZE);
            
            for (const controlData of batch) {
              try {
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
                  }
                }

                // Process parts recursively
                if (controlData.parts) {
                  await processPartsRecursively(controlData.parts, control, em, progress);
                }

                // Process control links
                await processControlLinks(controlData, control, em, progress, controlMap);

                // Process enhancements
                if (controlData.controls) {
                  for (const enhancementData of controlData.controls) {
                    try {
                      const enhancement = controlMap.get(enhancementData.id);
                      if (!enhancement) continue;

                      // Process enhancement parameters
                      if (enhancementData.params) {
                        for (const paramData of enhancementData.params) {
                          const parameter = new Parameter(
                            paramData.id,
                            paramData.label || '',
                            enhancement
                          );
                          em.persist(parameter);
                        }
                      }

                      // Process enhancement parts
                      if (enhancementData.parts) {
                        await processPartsRecursively(enhancementData.parts, enhancement, em, progress);
                      }

                      // Process enhancement links
                      await processControlLinks(enhancementData, enhancement, em, progress, controlMap);

                      progress.incrementControl();
                    } catch (error) {
                      progress.addError('enhancement', `Failed to process enhancement ${enhancementData.id}`, error);
                    }
                  }
                }

                progress.incrementControl();
              } catch (error) {
                progress.addError('control', `Failed to process control ${controlData.id}`, error);
              }
            }

            // Flush each batch
            await em.flush();
          }

          progress.incrementGroup();
        });
      } catch (error) {
        progress.addError('group', `Failed to process group ${groupData.id}`, error);
      }
    }

    const report = progress.getReport();
    console.log('Import completed. Final report:', JSON.stringify(report, null, 2));
    return report;

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('OSCAL validation failed:', error.errors);
      throw new Error('Invalid OSCAL format');
    }
    
    console.error('Unexpected error during import:', error);
    throw error;
  }
}

async function processPartsRecursively(
  parts: z.infer<typeof PartSchema>[],
  control: Control,
  em: EntityManager,
  progress: ImportProgress,
  parentPart?: Part
) {
  for (const partData of parts) {
    try {
      const part = new Part(
        partData.id,
        partData.name,
        partData.prose || '',
        control,
        parentPart
      );
      em.persist(part);

      if (partData.parts) {
        await processPartsRecursively(partData.parts, control, em, progress, part);
      }
    } catch (error) {
      progress.addError('part', `Failed to process part ${partData.id}`, error);
    }
  }
}

// Get the absolute path to the NIST catalog file
const catalogPath = path.resolve(__dirname, '../frameworks/nist_sp-800-53_rev4_catalog.json');

// Initialize MikroORM with project config and run import
MikroORM.init(mikroOrmConfig).then(orm => {
  console.log('Starting OSCAL import...');
  return importOSCAL(orm, catalogPath);
}).then(report => {
  console.log('Import completed successfully');
  console.log('Summary:', report);
  process.exit(0);
}).catch(error => {
  console.error('Import failed:', error);
  process.exit(1);
});
