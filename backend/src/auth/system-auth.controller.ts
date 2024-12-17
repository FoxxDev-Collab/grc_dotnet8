import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SystemAuthService } from './system-auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateSystemUserDto } from '../system-users/dto/create-system-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { SystemRole } from '../common/enums/system-role.enum';
@Controller("auth/system")
export class SystemAuthController {
    constructor(private readonly systemAuthService: SystemAuthService) { }
    @Post("login")
    async login(
    @Body()
    loginDto: LoginDto) {
        return this.systemAuthService.login(loginDto);
    }
    @Post("register")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(SystemRole.GLOBAL_ADMIN)
    async register(
    @Body()
    createSystemUserDto: CreateSystemUserDto) {
        return this.systemAuthService.register(createSystemUserDto);
    }
}
