import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, Inject, Logger, } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { AuditLoggingService } from './audit-logging.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationJwtGuard } from '../auth/guards/organization-jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ClientRolesGuard } from '../auth/guards/client-roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClientRoles } from '../auth/decorators/client-roles.decorator';
import { SystemRole } from '../common/enums/system-role.enum';
import { ClientRole } from '../common/enums/client-role.enum';
import { OrganizationAction } from '../entities/organization-audit-log.entity';
@Controller("organizations")
@UseGuards(OrganizationJwtGuard, RolesGuard, ClientRolesGuard)
export class OrganizationsController {
    private readonly logger = new Logger(OrganizationsController.name);
    constructor(private readonly organizationsService: OrganizationsService, private readonly auditLoggingService: AuditLoggingService) { }
    @Post()
    @Roles(SystemRole.GLOBAL_ADMIN)
    async create(
    @Body()
    createOrganizationDto: CreateOrganizationDto, 
    @Request()
    req) {
        this.logger.log(`Creating organization: ${JSON.stringify(createOrganizationDto)}`);
        const organization = await this.organizationsService.create(createOrganizationDto, req.user.id, req);
        this.logger.log(`Organization created: ${organization.id}`);
        return { data: organization };
    }
    @Get()
    async findAll(
    @Request()
    req) {
        this.logger.log(`Finding all organizations for user: ${req.user.id}`);
        const organizations = await this.organizationsService.findAll(req.user.id);
        this.logger.log(`Found ${organizations.length} organizations`);
        return { data: organizations };
    }
    @Get(":id")
    async findOne(
    @Param("id")
    id: string, 
    @Request()
    req) {
        this.logger.log(`Finding organization by ID: ${id} for user: ${req.user.id}`);
        const organization = await this.organizationsService.findOne(id, req.user.id);
        this.logger.log(`Organization found: ${JSON.stringify(organization)}`);
        return { data: organization };
    }
    @Get(":id/users")
    @ClientRoles(ClientRole.ADMIN, ClientRole.MANAGER)
    async getUsers(
    @Param("id")
    id: string, 
    @Query("page")
    page = 1, 
    @Query("pageSize")
    pageSize = 10, 
    @Request()
    req) {
        this.logger.log(`Getting users for organization: ${id}, page: ${page}, pageSize: ${pageSize}`);
        // First check if the user has access to this organization
        await this.organizationsService.findOne(id, req.user.id);
        // If findOne doesn't throw, the user has access
        const users = await this.organizationsService.getOrganizationUsers(id, page, pageSize);
        this.logger.log(`Found ${users.length} users for organization: ${id}`);
        return {
            data: {
                data: users,
                total: users.length,
                page,
                pageSize
            }
        };
    }
    @Patch(":id")
    @Roles(SystemRole.GLOBAL_ADMIN, SystemRole.ADMIN)
    @ClientRoles(ClientRole.ADMIN, ClientRole.MANAGER)
    async update(
    @Param("id")
    id: string, 
    @Body()
    updateOrganizationDto: UpdateOrganizationDto, 
    @Request()
    req) {
        this.logger.log(`Updating organization: ${id} with data: ${JSON.stringify(updateOrganizationDto)}`);
        const organization = await this.organizationsService.update(id, updateOrganizationDto, req.user.id, req);
        this.logger.log(`Organization updated: ${organization.id}`);
        return { data: organization };
    }
    @Delete(":id")
    @Roles(SystemRole.GLOBAL_ADMIN)
    async remove(
    @Param("id")
    id: string, 
    @Request()
    req) {
        this.logger.log(`Removing organization: ${id}`);
        const organization = await this.organizationsService.remove(id, req.user.id);
        this.logger.log(`Organization removed: ${organization.id}`);
        return { data: organization };
    }
    @Post(":id/users")
    @Roles(SystemRole.GLOBAL_ADMIN, SystemRole.ADMIN)
    @ClientRoles(ClientRole.ADMIN)
    async addUser(
    @Param("id")
    id: string, 
    @Body("email")
    email: string, 
    @Request()
    req) {
        this.logger.log(`Adding user ${email} to organization: ${id}`);
        const userOrg = await this.organizationsService.addUser(id, email, req.user.id);
        this.logger.log(`User added to organization: ${JSON.stringify(userOrg)}`);
        return { data: userOrg };
    }
    @Delete(":id/users/:userId")
    @Roles(SystemRole.GLOBAL_ADMIN, SystemRole.ADMIN)
    @ClientRoles(ClientRole.ADMIN)
    async removeUser(
    @Param("id")
    id: string, 
    @Param("userId")
    userId: string, 
    @Request()
    req) {
        this.logger.log(`Removing user ${userId} from organization: ${id}`);
        const userOrg = await this.organizationsService.removeUser(id, userId, req.user.id);
        this.logger.log(`User removed from organization: ${JSON.stringify(userOrg)}`);
        return { data: userOrg };
    }
    @Get(":id/audit-logs")
    @Roles(SystemRole.GLOBAL_ADMIN, SystemRole.ADMIN)
    @ClientRoles(ClientRole.ADMIN, ClientRole.MANAGER)
    async getAuditLogs(
    @Request()
    req, 
    @Param("id")
    id: string, 
    @Query("startDate")
    startDate?: string, 
    @Query("endDate")
    endDate?: string, 
    @Query("actions")
    actions?: OrganizationAction[], 
    @Query("performedById")
    performedById?: string) {
        this.logger.log(`Getting audit logs for organization: ${id}`);
        const auditLogs = await this.auditLoggingService.getOrganizationAuditLogs(id, {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            actions,
            performedById,
        });
        this.logger.log(`Found ${auditLogs.length} audit logs`);
        return { data: auditLogs };
    }
}
