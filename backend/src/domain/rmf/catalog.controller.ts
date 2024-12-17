import { Controller, Get, Post, Param, NotFoundException, UseGuards, Logger, UseInterceptors, UploadedFile, Body, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { CatalogService } from './catalog.service';
import { CatalogAuthGuard } from './guards/catalog-auth.guard';
import { CatalogDto, GroupDto, ControlDto, PaginationDto, PaginationSchema, ControlBasicDto } from './dto/catalog.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('catalogs')
@UseGuards(CatalogAuthGuard)
export class CatalogController {
  private readonly logger = new Logger(CatalogController.name);

  constructor(private readonly catalogService: CatalogService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './frameworks',
      filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().replace(/[^a-z0-9\-\_\.]/g, '_');
        cb(null, fileName);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(json)$/)) {
        return cb(new Error('Only JSON files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  async uploadCatalog(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string
  ) {
    this.logger.log(`Uploading catalog file: ${file.originalname}`);
    const startTime = Date.now();

    try {
      const result = await this.catalogService.importCatalog(file.path);
      
      const duration = Date.now() - startTime;
      this.logger.log(`Successfully imported catalog in ${duration}ms`);
      
      return {
        success: true,
        message: 'Catalog imported successfully',
        details: result
      };
    } catch (error) {
      this.logger.error(`Error importing catalog: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  async findAll(): Promise<CatalogDto[]> {
    this.logger.log('GET /catalogs - Retrieving all catalogs');
    const startTime = Date.now();

    try {
      const catalogs = await this.catalogService.findAll();
      const dtos = catalogs.map(catalog => {
        const groups = catalog.groups.getItems();
        return {
          id: catalog.id,
          title: catalog.title,
          version: catalog.version,
          lastModified: catalog.lastModified,
          groups: groups.map(group => ({
            id: group.id,
            title: group.title,
            class: group.class,
            controls: []
          }))
        };
      });

      const duration = Date.now() - startTime;
      this.logger.log(`Successfully retrieved ${dtos.length} catalogs in ${duration}ms`);
      
      return dtos;
    } catch (error) {
      this.logger.error(`Error retrieving catalogs: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(PaginationSchema)) pagination?: PaginationDto
  ): Promise<CatalogDto> {
    this.logger.log(`GET /catalogs/${id} - Retrieving catalog with pagination`);
    const startTime = Date.now();

    try {
      // If no pagination params provided, use findCatalogBasic
      if (!pagination?.page && !pagination?.limit) {
        const catalog = await this.catalogService.findCatalogBasic(id);
        if (!catalog) {
          this.logger.warn(`Catalog not found: ${id}`);
          throw new NotFoundException(`Catalog with ID ${id} not found`);
        }

        const groups = catalog.groups.getItems();
        return {
          id: catalog.id,
          title: catalog.title,
          version: catalog.version,
          lastModified: catalog.lastModified,
          groups: groups.map(group => ({
            id: group.id,
            title: group.title,
            class: group.class,
            controls: []
          }))
        };
      }

      // Otherwise use pagination
      const { catalog, totalGroups, hasMore } = await this.catalogService.findCatalogWithPagination(id, pagination);
      if (!catalog) {
        this.logger.warn(`Catalog not found: ${id}`);
        throw new NotFoundException(`Catalog with ID ${id} not found`);
      }

      const groups = catalog.groups.getItems();
      const dto: CatalogDto = {
        id: catalog.id,
        title: catalog.title,
        version: catalog.version,
        lastModified: catalog.lastModified,
        totalGroups,
        hasMore,
        groups: groups.map(group => ({
          id: group.id,
          title: group.title,
          class: group.class,
          controls: group.controls.getItems().map(control => ({
            id: control.id,
            title: control.title,
            class: control.class
          }))
        }))
      };

      const duration = Date.now() - startTime;
      this.logger.log(
        `Successfully retrieved catalog: ${catalog.title} (${catalog.version})\n` +
        `Statistics:\n` +
        `- Groups: ${groups.length}\n` +
        `Duration: ${duration}ms`
      );

      return dto;
    } catch (error) {
      this.logger.error(`Error retrieving catalog ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('groups/:groupId')
  async findGroup(
    @Param('groupId') groupId: string,
    @Query(new ZodValidationPipe(PaginationSchema)) pagination?: PaginationDto
  ): Promise<GroupDto> {
    this.logger.log(`GET /catalogs/groups/${groupId} - Retrieving group`);
    const startTime = Date.now();

    try {
      // If no pagination params provided, use findGroup
      if (!pagination?.page && !pagination?.limit) {
        const group = await this.catalogService.findGroup(groupId);
        if (!group) {
          this.logger.warn(`Group not found: ${groupId}`);
          throw new NotFoundException(`Group with ID ${groupId} not found`);
        }

        return {
          id: group.id,
          title: group.title,
          class: group.class,
          controls: group.controls.getItems().map(control => ({
            id: control.id,
            title: control.title,
            class: control.class
          }))
        };
      }

      // Otherwise use pagination
      const { group, totalControls, hasMore } = await this.catalogService.findGroupWithPagination(groupId, pagination);
      if (!group) {
        this.logger.warn(`Group not found: ${groupId}`);
        throw new NotFoundException(`Group with ID ${groupId} not found`);
      }

      const dto: GroupDto = {
        id: group.id,
        title: group.title,
        class: group.class,
        totalControls,
        hasMore,
        controls: group.controls.getItems().map(control => ({
          id: control.id,
          title: control.title,
          class: control.class
        }))
      };

      const duration = Date.now() - startTime;
      this.logger.log(
        `Successfully retrieved group: ${group.title}\n` +
        `Duration: ${duration}ms`
      );

      return dto;
    } catch (error) {
      this.logger.error(`Error retrieving group ${groupId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('controls/:controlId')
  async findControl(@Param('controlId') controlId: string): Promise<ControlDto> {
    this.logger.log(`GET /catalogs/controls/${controlId} - Retrieving control`);
    const startTime = Date.now();

    try {
      const control = await this.catalogService.findControl(controlId);
      if (!control) {
        this.logger.warn(`Control not found: ${controlId}`);
        throw new NotFoundException(`Control with ID ${controlId} not found`);
      }

      const parts = control.parts.getItems();
      const parameters = control.parameters.getItems();
      const enhancements = control.enhancements?.getItems() || [];
      const outgoingLinks = control.outgoingLinks?.getItems() || [];
      const incomingLinks = control.incomingLinks?.getItems() || [];

      const dto: ControlDto = {
        id: control.id,
        title: control.title,
        class: control.class,
        parts: parts.map(part => ({
          id: part.id,
          name: part.name,
          prose: part.prose
        })),
        parameters: parameters.map(param => ({
          id: param.id,
          label: param.label
        })),
        enhancements: enhancements.map(enhancement => ({
          id: enhancement.id,
          title: enhancement.title,
          class: enhancement.class,
          parts: enhancement.parts.getItems().map(part => ({
            id: part.id,
            name: part.name,
            prose: part.prose
          })),
          parameters: enhancement.parameters.getItems().map(param => ({
            id: param.id,
            label: param.label
          }))
        })),
        outgoingLinks: outgoingLinks.map(link => ({
          rel: link.rel,
          href: link.href,
          targetControl: link.targetControl ? {
            id: link.targetControl.id,
            title: link.targetControl.title,
            class: link.targetControl.class
          } : undefined
        })),
        incomingLinks: incomingLinks.map(link => ({
          rel: link.rel,
          href: link.href,
          sourceControl: link.sourceControl ? {
            id: link.sourceControl.id,
            title: link.sourceControl.title,
            class: link.sourceControl.class
          } : undefined
        }))
      };

      const duration = Date.now() - startTime;
      this.logger.log(
        `Successfully retrieved control: ${control.title}\n` +
        `- Parts: ${parts.length}\n` +
        `- Parameters: ${parameters.length}\n` +
        `- Enhancements: ${enhancements.length}\n` +
        `- Outgoing Links: ${outgoingLinks.length}\n` +
        `- Incoming Links: ${incomingLinks.length}\n` +
        `Duration: ${duration}ms`
      );

      return dto;
    } catch (error) {
      this.logger.error(`Error retrieving control ${controlId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('controls/:controlId/related')
  async getRelatedControls(@Param('controlId') controlId: string): Promise<ControlBasicDto[]> {
    this.logger.log(`GET /catalogs/controls/${controlId}/related - Retrieving related controls`);
    const startTime = Date.now();

    try {
      const relatedControls = await this.catalogService.getRelatedControls(controlId);
      
      const dto = relatedControls.map(control => ({
        id: control.id,
        title: control.title,
        class: control.class
      }));

      const duration = Date.now() - startTime;
      this.logger.log(
        `Successfully retrieved related controls for ${controlId}\n` +
        `- Related Controls: ${dto.length}\n` +
        `Duration: ${duration}ms`
      );

      return dto;
    } catch (error) {
      this.logger.error(`Error retrieving related controls for ${controlId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
