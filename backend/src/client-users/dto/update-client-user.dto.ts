import { IsEmail, IsEnum, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { ClientRole } from '../../common/enums/client-role.enum';
import { OrganizationRole } from '../../common/enums/organization-role.enum';
export class UpdateClientUserDto {
    @IsOptional()
    @IsString()
    firstName?: string;
    @IsOptional()
    @IsString()
    lastName?: string;
    @IsOptional()
    @IsEmail()
    email?: string;
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;
    @IsOptional()
    @IsEnum(ClientRole)
    clientRole?: ClientRole;
    @ValidateIf(o => o.clientRole && o.clientRole !== ClientRole.USER)
    @IsEnum(OrganizationRole)
    organizationRole?: OrganizationRole;
    @IsOptional()
    @IsString()
    organizationId?: string;
    @IsOptional()
    @IsString()
    isActive?: boolean;
}
