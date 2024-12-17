import { z } from 'zod';

export class PaginationDto {
  page: number = 1;
  limit: number = 10;
}

export class ControlBasicDto {
  id: string;
  title: string;
  class: string;
}

export class PartDto {
  id: string;
  name: string;
  prose: string;
}

export class ParameterDto {
  id: string;
  label: string;
}

export class EnhancementDto extends ControlBasicDto {
  parts: PartDto[];
  parameters: ParameterDto[];
}

export class LinkDto {
  rel: string;
  href: string;
  targetControl?: ControlBasicDto;
  sourceControl?: ControlBasicDto;
}

export class ControlDto extends ControlBasicDto {
  parts: PartDto[];
  parameters: ParameterDto[];
  enhancements: EnhancementDto[];
  outgoingLinks: LinkDto[];
  incomingLinks: LinkDto[];
}

export class GroupDto {
  id: string;
  title: string;
  class: string;
  controls: ControlBasicDto[];
  totalControls?: number;
  hasMore?: boolean;
}

export class CatalogDto {
  id: string;
  title: string;
  version: string;
  lastModified: Date;
  groups: GroupDto[];
  totalGroups?: number;
  hasMore?: boolean;
}

export const PaginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10)
}).transform(val => ({
  page: Math.max(1, val.page),
  limit: Math.min(100, Math.max(1, val.limit))
}));
