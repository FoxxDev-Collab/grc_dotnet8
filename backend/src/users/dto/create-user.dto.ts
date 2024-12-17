import { SystemRole } from '../../common/enums/system-role.enum';
import { IsEmail, IsString, IsOptional, IsBoolean, IsEnum, } from 'class-validator';
export class CreateUserDto {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
    @IsString()
    name: string;
    @IsOptional()
    @IsEnum(SystemRole)
    systemRole?: SystemRole;
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
