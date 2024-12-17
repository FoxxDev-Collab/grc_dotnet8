import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { ClientUser } from '../entities/client-user.entity';
import { Organization } from '../entities/organization.entity';
import { CreateClientUserDto } from './dto/create-client-user.dto';
import { UpdateClientUserDto } from './dto/update-client-user.dto';
import * as bcrypt from 'bcrypt';
import { ClientRole } from '../common/enums/client-role.enum';
@Injectable()
export class ClientUsersService {
    private readonly logger = new Logger(ClientUsersService.name);
    constructor(private readonly em: EntityManager) { }
    async findAll(organizationId: string): Promise<ClientUser[]> {
        this.logger.log(`Finding all client users for organization: ${organizationId}`);
        try {
            const organization = await this.em.findOne(Organization, { id: organizationId });
            if (!organization) {
                this.logger.warn(`Organization not found: ${organizationId}`);
                throw new NotFoundException("Organization not found");
            }
            const users = await this.em.find(ClientUser, { organization }, {
                populate: ["organization"],
                filters: false
            });
            this.logger.log(`Found ${users.length} client users for organization: ${organizationId}`);
            const validUsers = users.filter(user => {
                try {
                    return user.validateRoleMapping();
                }
                catch (error) {
                    this.logger.warn(`Invalid role mapping for user ${user.id}: ${error.message}`);
                    return false;
                }
            });
            this.logger.log(`Returning ${validUsers.length} valid users out of ${users.length} total`);
            return validUsers;
        }
        catch (error) {
            this.logger.error(`Error in findAll: ${error.message}`, error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException("Failed to load client users");
        }
    }
    async create(organizationId: string, dto: CreateClientUserDto): Promise<ClientUser> {
        this.logger.log(`Creating client user with email: ${dto.email} for organization: ${organizationId}`);
        // Check if email already exists
        const existingUser = await this.em.findOne(ClientUser, { email: dto.email });
        if (existingUser) {
            this.logger.warn(`Email already exists: ${dto.email}`);
            throw new ConflictException("Email already exists");
        }
        // Get organization reference
        const organization = await this.em.findOne(Organization, { id: organizationId });
        if (!organization) {
            this.logger.warn(`Organization not found: ${organizationId}`);
            throw new NotFoundException("Organization not found");
        }
        // Handle USER role case
        if (dto.clientRole === ClientRole.USER && dto.organizationRole) {
            this.logger.warn("Attempted to assign organization role to USER client role");
            throw new BadRequestException("User role cannot have an organization role");
        }
        // Create new client user
        const clientUser = new ClientUser();
        clientUser.firstName = dto.firstName;
        clientUser.lastName = dto.lastName;
        clientUser.email = dto.email;
        clientUser.clientRole = dto.clientRole;
        clientUser.organizationRole = dto.organizationRole;
        clientUser.organization = organization;
        // Hash password
        const salt = await bcrypt.genSalt();
        clientUser.password = await bcrypt.hash(dto.password, salt);
        try {
            await this.em.persistAndFlush(clientUser);
            this.logger.log(`Successfully created client user: ${clientUser.id}`);
            return clientUser;
        }
        catch (error) {
            this.logger.error("Failed to create client user", error.stack);
            if (error.name === "ValidationError") {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }
    async findOne(organizationId: string, id: string): Promise<ClientUser> {
        this.logger.log(`Finding client user by ID: ${id} in organization: ${organizationId}`);
        const clientUser = await this.em.findOne(ClientUser, {
            id,
            organization: { id: organizationId }
        }, {
            populate: ["organization"]
        });
        if (!clientUser) {
            this.logger.warn(`Client user not found: ${id} in organization: ${organizationId}`);
            throw new NotFoundException("Client user not found");
        }
        this.logger.log(`Found client user: ${id}`);
        return clientUser;
    }
    async update(organizationId: string, id: string, dto: UpdateClientUserDto): Promise<ClientUser> {
        this.logger.log(`Updating client user: ${id} in organization: ${organizationId}`);
        const clientUser = await this.findOne(organizationId, id);
        // If email is being updated, check for uniqueness
        if (dto.email && dto.email !== clientUser.email) {
            this.logger.log(`Checking email uniqueness for update: ${dto.email}`);
            const existingUser = await this.em.findOne(ClientUser, { email: dto.email });
            if (existingUser) {
                this.logger.warn(`Email already exists during update: ${dto.email}`);
                throw new ConflictException("Email already exists");
            }
        }
        // Handle role updates
        if (dto.clientRole === ClientRole.USER) {
            this.logger.log("Setting organization role to null for USER client role");
            clientUser.organizationRole = null;
        }
        // Update fields
        if (dto.firstName)
            clientUser.firstName = dto.firstName;
        if (dto.lastName)
            clientUser.lastName = dto.lastName;
        if (dto.email)
            clientUser.email = dto.email;
        if (dto.clientRole)
            clientUser.clientRole = dto.clientRole;
        if (dto.organizationRole)
            clientUser.organizationRole = dto.organizationRole;
        if (dto.password) {
            this.logger.log("Updating password");
            const salt = await bcrypt.genSalt();
            clientUser.password = await bcrypt.hash(dto.password, salt);
        }
        try {
            await this.em.persistAndFlush(clientUser);
            this.logger.log(`Successfully updated client user: ${id}`);
            return clientUser;
        }
        catch (error) {
            this.logger.error("Failed to update client user", error.stack);
            if (error.name === "ValidationError") {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }
    async remove(organizationId: string, id: string): Promise<void> {
        this.logger.log(`Removing client user: ${id} from organization: ${organizationId}`);
        const clientUser = await this.findOne(organizationId, id);
        await this.em.removeAndFlush(clientUser);
        this.logger.log(`Successfully removed client user: ${id}`);
    }
    async activate(organizationId: string, id: string): Promise<ClientUser> {
        this.logger.log(`Activating client user: ${id} in organization: ${organizationId}`);
        const clientUser = await this.findOne(organizationId, id);
        clientUser.isActive = true;
        await this.em.persistAndFlush(clientUser);
        this.logger.log(`Successfully activated client user: ${id}`);
        return clientUser;
    }
    async deactivate(organizationId: string, id: string): Promise<ClientUser> {
        this.logger.log(`Deactivating client user: ${id} in organization: ${organizationId}`);
        const clientUser = await this.findOne(organizationId, id);
        clientUser.isActive = false;
        await this.em.persistAndFlush(clientUser);
        this.logger.log(`Successfully deactivated client user: ${id}`);
        return clientUser;
    }
    async changeRole(organizationId: string, id: string, clientRole: ClientRole): Promise<ClientUser> {
        this.logger.log(`Changing role for client user: ${id} in organization: ${organizationId} to ${clientRole}`);
        const clientUser = await this.findOne(organizationId, id);
        clientUser.clientRole = clientRole;
        // Clear organization role if changing to USER role
        if (clientRole === ClientRole.USER) {
            clientUser.organizationRole = null;
        }
        await this.em.persistAndFlush(clientUser);
        this.logger.log(`Successfully changed role for client user: ${id}`);
        return clientUser;
    }
    async findByEmail(email: string): Promise<ClientUser | null> {
        this.logger.log(`Finding client user by email: ${email}`);
        return this.em.findOne(ClientUser, { email }, {
            populate: ["organization"]
        });
    }
    async validatePassword(clientUser: ClientUser, password: string): Promise<boolean> {
        this.logger.log(`Validating password for client user: ${clientUser.id}`);
        return bcrypt.compare(password, clientUser.password);
    }
}
