import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Control } from '../../entities/control.entity';
import { ControlLink } from '../../entities/control-link.entity';
import { Part } from '../../entities/part.entity';
import { Parameter } from '../../entities/parameter.entity';
import { Group } from '../../entities/group.entity';
import { Catalog } from '../../entities/catalog.entity';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Control,
      ControlLink,
      Part,
      Parameter,
      Group,
      Catalog,
    ]),
  ],
  providers: [CatalogService],
  controllers: [CatalogController],
  exports: [CatalogService],
})
export class CatalogModule {}
