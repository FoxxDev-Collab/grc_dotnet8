import { IsEmail, IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { SystemRole } from '../../common/enums/system-role.enum';
export class RegisterDto {
    @IsEmail()
    email!: string;
    @IsString()
    password!: string;
    @IsString()
    firstName!: string;
    @IsString()
    lastName!: string;
    @IsEnum(SystemRole)
    @IsOptional()
    role?: SystemRole;
    @IsUUID()
    @IsOptional()
    organizationId?: string;
}
