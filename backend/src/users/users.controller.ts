import { Controller, Get, Body, Patch, Param, Delete, UseGuards, } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SystemRole } from '../common/enums/system-role.enum';
@Controller("system-users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(SystemRole.GLOBAL_ADMIN) // Only GLOBAL_ADMIN can manage system users
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Get()
    async findAll() {
        const users = await this.usersService.findAll();
        return { data: users };
    }
    @Get(":id")
    async findOne(
    @Param("id")
    id: string) {
        const user = await this.usersService.findOne(id);
        return { data: user };
    }
    @Patch(":id")
    async update(
    @Param("id")
    id: string, 
    @Body()
    updateUserDto: UpdateUserDto) {
        const user = await this.usersService.update(id, updateUserDto);
        return { data: user };
    }
    @Delete(":id")
    async remove(
    @Param("id")
    id: string) {
        const user = await this.usersService.remove(id);
        return { data: user };
    }
}
