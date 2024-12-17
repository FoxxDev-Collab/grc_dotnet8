import { Controller, Get, Post, Body, Param, UseGuards, Put, Delete, Logger } from '@nestjs/common';
import { ClientUsersService } from './client-users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationAuthGuard } from '../auth/guards/organization-auth.guard';
import { ClientRoles } from '../auth/decorators/client-roles.decorator';
import { ClientRole } from '../common/enums/client-role.enum';
import { CreateClientUserDto } from './dto/create-client-user.dto';
import { UpdateClientUserDto } from './dto/update-client-user.dto';
@Controller("organizations/:organizationId/client-users")
export class ClientUsersController {
    private readonly logger = new Logger("ClientUsersController");
    constructor(private readonly clientUsersService: ClientUsersService) { }
    @Get()
    @UseGuards(JwtAuthGuard, OrganizationAuthGuard)
    async findAll(
    @Param("organizationId")
    organizationId: string) {
        console.log("[ClientUsersController] Finding all client users:", {
            organizationId,
            timestamp: new Date().toISOString()
        });
        const result = await this.clientUsersService.findAll(organizationId);
        console.log("[ClientUsersController] Found client users:", {
            organizationId,
            count: result.length,
            timestamp: new Date().toISOString()
        });
        return result;
    }
    @Get(":id")
    @UseGuards(JwtAuthGuard, OrganizationAuthGuard)
    async findOne(
    @Param("organizationId")
    organizationId: string, 
    @Param("id")
    id: string) {
        console.log("[ClientUsersController] Finding client user:", {
            organizationId,
            userId: id,
            timestamp: new Date().toISOString()
        });
        const result = await this.clientUsersService.findOne(organizationId, id);
        console.log("[ClientUsersController] Found client user:", {
            organizationId,
            userId: id,
            found: !!result,
            timestamp: new Date().toISOString()
        });
        return result;
    }
    @Post()
    @UseGuards(JwtAuthGuard, OrganizationAuthGuard)
    @ClientRoles(ClientRole.ADMIN)
    async create(
    @Param("organizationId")
    organizationId: string, 
    @Body()
    createClientUserDto: CreateClientUserDto) {
        console.log("[ClientUsersController] Creating client user:", {
            organizationId,
            userData: { ...createClientUserDto, password: "[REDACTED]" },
            timestamp: new Date().toISOString()
        });
        const result = await this.clientUsersService.create(organizationId, createClientUserDto);
        console.log("[ClientUsersController] Created client user:", {
            organizationId,
            userId: result.id,
            timestamp: new Date().toISOString()
        });
        return result;
    }
    @Put(":id")
    @UseGuards(JwtAuthGuard, OrganizationAuthGuard)
    @ClientRoles(ClientRole.ADMIN)
    async update(
    @Param("organizationId")
    organizationId: string, 
    @Param("id")
    id: string, 
    @Body()
    updateClientUserDto: UpdateClientUserDto) {
        console.log("[ClientUsersController] Updating client user:", {
            organizationId,
            userId: id,
            updateData: { ...updateClientUserDto, password: updateClientUserDto.password ? "[REDACTED]" : undefined },
            timestamp: new Date().toISOString()
        });
        const result = await this.clientUsersService.update(organizationId, id, updateClientUserDto);
        console.log("[ClientUsersController] Updated client user:", {
            organizationId,
            userId: id,
            success: !!result,
            timestamp: new Date().toISOString()
        });
        return result;
    }
    @Delete(":id")
    @UseGuards(JwtAuthGuard, OrganizationAuthGuard)
    @ClientRoles(ClientRole.ADMIN)
    async remove(
    @Param("organizationId")
    organizationId: string, 
    @Param("id")
    id: string) {
        console.log("[ClientUsersController] Removing client user:", {
            organizationId,
            userId: id,
            timestamp: new Date().toISOString()
        });
        await this.clientUsersService.remove(organizationId, id);
        console.log("[ClientUsersController] Removed client user:", {
            organizationId,
            userId: id,
            timestamp: new Date().toISOString()
        });
        return { success: true };
    }
    @Put(":id/activate")
    @UseGuards(JwtAuthGuard, OrganizationAuthGuard)
    @ClientRoles(ClientRole.ADMIN)
    async activate(
    @Param("organizationId")
    organizationId: string, 
    @Param("id")
    id: string) {
        console.log("[ClientUsersController] Activating client user:", {
            organizationId,
            userId: id,
            timestamp: new Date().toISOString()
        });
        const result = await this.clientUsersService.activate(organizationId, id);
        console.log("[ClientUsersController] Activated client user:", {
            organizationId,
            userId: id,
            success: !!result,
            timestamp: new Date().toISOString()
        });
        return result;
    }
    @Put(":id/deactivate")
    @UseGuards(JwtAuthGuard, OrganizationAuthGuard)
    @ClientRoles(ClientRole.ADMIN)
    async deactivate(
    @Param("organizationId")
    organizationId: string, 
    @Param("id")
    id: string) {
        console.log("[ClientUsersController] Deactivating client user:", {
            organizationId,
            userId: id,
            timestamp: new Date().toISOString()
        });
        const result = await this.clientUsersService.deactivate(organizationId, id);
        console.log("[ClientUsersController] Deactivated client user:", {
            organizationId,
            userId: id,
            success: !!result,
            timestamp: new Date().toISOString()
        });
        return result;
    }
    @Put(":id/change-role")
    @UseGuards(JwtAuthGuard, OrganizationAuthGuard)
    @ClientRoles(ClientRole.ADMIN)
    async changeRole(
    @Param("organizationId")
    organizationId: string, 
    @Param("id")
    id: string, 
    @Body()
    roleData: {
        clientRole: ClientRole;
    }) {
        console.log("[ClientUsersController] Changing client user role:", {
            organizationId,
            userId: id,
            newRole: roleData.clientRole,
            timestamp: new Date().toISOString()
        });
        const result = await this.clientUsersService.changeRole(organizationId, id, roleData.clientRole);
        console.log("[ClientUsersController] Changed client user role:", {
            organizationId,
            userId: id,
            success: !!result,
            timestamp: new Date().toISOString()
        });
        return result;
    }
}
