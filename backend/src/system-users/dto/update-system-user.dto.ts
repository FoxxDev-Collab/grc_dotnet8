import { IsEmail, IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { SystemRole } from '../../common/enums/system-role.enum';
export class UpdateSystemUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;
    @IsString()
    @IsOptional()
    firstName?: string;
    @IsString()
    @IsOptional()
    lastName?: string;
    @IsEnum(SystemRole)
    @IsOptional()
    role?: SystemRole;
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
    @IsString()
    @IsOptional()
    password?: string;
}
