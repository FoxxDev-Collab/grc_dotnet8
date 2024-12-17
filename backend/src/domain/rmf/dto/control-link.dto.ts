import { IsString, IsNotEmpty } from 'class-validator';

export class ControlLinkDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  sourceControlId: string;

  @IsString()
  @IsNotEmpty()
  targetControlId: string;

  @IsString()
  @IsNotEmpty()
  rel: string;

  @IsString()
  href: string;
}

export class CreateControlLinkDto {
  @IsString()
  @IsNotEmpty()
  sourceControlId: string;

  @IsString()
  @IsNotEmpty()
  targetControlId: string;

  @IsString()
  @IsNotEmpty()
  rel: string;

  @IsString()
  href: string;
}

export class UpdateControlLinkDto {
  @IsString()
  rel?: string;

  @IsString()
  href?: string;
}
