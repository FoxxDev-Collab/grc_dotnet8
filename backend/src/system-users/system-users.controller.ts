import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, } from '@nestjs/common';
import { SystemUsersService } from './system-users.service';
import { CreateSystemUserDto } from './dto/create-system-user.dto';
import { UpdateSystemUserDto } from './dto/update-system-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SystemRole } from '../common/enums/system-role.enum';
@Controller("system-users")
@UseGuards(JwtAuthGuard)
export class SystemUsersController {
    constructor(private readonly systemUsersService: SystemUsersService) { }
    @Post()
    @UseGuards(RolesGuard)
    @Roles(SystemRole.GLOBAL_ADMIN)
    async create(
    @Body()
    createSystemUserDto: CreateSystemUserDto) {
        const user = await this.systemUsersService.create(createSystemUserDto);
        return { data: user };
    }
    @Get()
    @UseGuards(RolesGuard)
    @Roles(SystemRole.GLOBAL_ADMIN)
    async findAll() {
        const users = await this.systemUsersService.findAll();
        return { data: users };
    }
    @Get("me")
    async findMe(
    @Request()
    req) {
        const user = await this.systemUsersService.findOne(req.user.id);
        return { data: user };
    }
    @Get(":id")
    @UseGuards(RolesGuard)
    @Roles(SystemRole.GLOBAL_ADMIN)
    async findOne(
    @Param("id")
    id: string) {
        const user = await this.systemUsersService.findOne(id);
        return { data: user };
    }
    @Patch(":id")
    @UseGuards(RolesGuard)
    @Roles(SystemRole.GLOBAL_ADMIN)
    async update(
    @Param("id")
    id: string, 
    @Body()
    updateSystemUserDto: UpdateSystemUserDto) {
        const user = await this.systemUsersService.update(id, updateSystemUserDto);
        return { data: user };
    }
    @Delete(":id")
    @UseGuards(RolesGuard)
    @Roles(SystemRole.GLOBAL_ADMIN)
    async remove(
    @Param("id")
    id: string) {
        const user = await this.systemUsersService.remove(id);
        return { data: user };
    }
}
