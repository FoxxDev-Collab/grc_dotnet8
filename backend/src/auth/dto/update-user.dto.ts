import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { SystemRole } from '../../common/enums/system-role.enum';
export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;
    @IsOptional()
    @IsString()
    name?: string;
    @IsOptional()
    @IsEnum(SystemRole)
    systemRole?: SystemRole;
}
