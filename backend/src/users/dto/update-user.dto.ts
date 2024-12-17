import { SystemRole } from '../../common/enums/system-role.enum';
import { IsEmail, IsString, IsOptional, IsBoolean, IsEnum, } from 'class-validator';
export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;
    @IsOptional()
    @IsString()
    firstName?: string;
    @IsOptional()
    @IsString()
    lastName?: string;
    @IsOptional()
    @IsEnum(SystemRole)
    role?: SystemRole;
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
