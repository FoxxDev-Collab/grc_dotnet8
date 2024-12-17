import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { ClientRole } from '../../common/enums/client-role.enum';
import { OrganizationRole } from '../../common/enums/organization-role.enum';
export class CreateClientUserDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;
    @IsNotEmpty()
    @IsString()
    lastName: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
    @IsNotEmpty()
    @IsEnum(ClientRole)
    clientRole: ClientRole;
    @ValidateIf(o => o.clientRole !== ClientRole.USER)
    @IsNotEmpty({ message: "Organization role is required for non-USER client roles" })
    @IsEnum(OrganizationRole)
    organizationRole?: OrganizationRole;
    @IsNotEmpty()
    @IsString()
    organizationId: string;
}
