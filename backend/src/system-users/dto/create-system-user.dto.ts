import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';
import { SystemRole } from '../../common/enums/system-role.enum';
export class CreateSystemUserDto {
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
    role?: SystemRole = SystemRole.ADMIN;
}
