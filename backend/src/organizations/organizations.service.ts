import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Organization } from '../entities/organization.entity';
import { SystemUser } from '../entities/system-user.entity';
import { ClientUser } from '../entities/client-user.entity';
import { UserOrganization } from '../entities/user-organization.entity';
import { RiskMatrixEntry } from '../entities/risk-matrix-entry.entity';
import { RiskProfile } from '../entities/risk-profile.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { SystemRole } from '../common/enums/system-role.enum';
import { AuditLoggingService } from './audit-logging.service';
import { OrganizationAction } from '../entities/organization-audit-log.entity';
import { RiskLevel } from '../enums/risk.enum';
import { Request } from 'express';
@Injectable()
export class OrganizationsService {
    private readonly logger = new Logger(OrganizationsService.name);
    constructor(private readonly em: EntityManager, private readonly auditLoggingService: AuditLoggingService) { }
    async getOrganizationUsers(organizationId: string, page: number = 1, pageSize: number = 10) {
        this.logger.log(`[getOrganizationUsers] Finding organization: ${organizationId}`);
        const organization = await this.em.findOne(Organization, { id: organizationId });
        if (!organization) {
            this.logger.error(`[getOrganizationUsers] Organization not found: ${organizationId}`);
            throw new UnauthorizedException("Organization not found");
        }
        this.logger.log(`[getOrganizationUsers] Finding users for organization: ${organizationId}`);
        const userOrgs = await this.em.find(UserOrganization, { organization }, {
            populate: ["systemUser", "clientUser"],
            limit: pageSize,
            offset: (page - 1) * pageSize,
        });
        this.logger.log(`[getOrganizationUsers] Found ${userOrgs.length} users`);
        return userOrgs;
    }
    async create(createOrganizationDto: CreateOrganizationDto, userId: string, req: Request) {
        // Fork the EntityManager to create a new context for the transaction
        const em = this.em.fork();
        try {
            this.logger.log(`[create] Finding system user: ${userId}`);
            const systemUser = await em.findOne(SystemUser, { id: userId });
            if (!systemUser) {
                this.logger.error(`[create] System user not found: ${userId}`);
                throw new UnauthorizedException("User not found");
            }
            // Only GLOBAL_ADMIN can create organizations
            if (systemUser.role !== SystemRole.GLOBAL_ADMIN) {
                this.logger.error(`[create] User ${userId} is not a GLOBAL_ADMIN`);
                throw new UnauthorizedException("Only global admins can create organizations");
            }
            // Begin transaction
            await em.begin();
            this.logger.log(`[create] Creating new organization: ${createOrganizationDto.name}`);
            const organization = new Organization();
            organization.name = createOrganizationDto.name;
            organization.type = createOrganizationDto.type;
            organization.description = createOrganizationDto.description;
            organization.isActive = createOrganizationDto.isActive ?? true;
            organization.isServiceProvider = createOrganizationDto.isServiceProvider ?? false;
            organization.primaryContact = createOrganizationDto.primaryContact;
            organization.email = createOrganizationDto.email;
            organization.phone = createOrganizationDto.phone;
            organization.address = createOrganizationDto.address;
            // Create risk profile using provided data or defaults
            this.logger.log(`[create] Creating risk profile for organization`);
            const riskProfile = new RiskProfile();
            if (createOrganizationDto.riskProfile) {
                riskProfile.businessFunctions = createOrganizationDto.riskProfile.businessFunctions;
                riskProfile.keyAssets = createOrganizationDto.riskProfile.keyAssets;
                riskProfile.complianceFrameworks = createOrganizationDto.riskProfile.complianceFrameworks;
                riskProfile.dataTypes = createOrganizationDto.riskProfile.dataTypes;
                riskProfile.operationalRisk = createOrganizationDto.riskProfile.operationalRisk;
                riskProfile.dataSecurityRisk = createOrganizationDto.riskProfile.dataSecurityRisk;
                riskProfile.complianceRisk = createOrganizationDto.riskProfile.complianceRisk;
                riskProfile.financialRisk = createOrganizationDto.riskProfile.financialRisk;
            }
            else {
                riskProfile.businessFunctions = "Not specified";
                riskProfile.keyAssets = "Not specified";
                riskProfile.complianceFrameworks = [];
                riskProfile.dataTypes = [];
                riskProfile.operationalRisk = RiskLevel.LOW;
                riskProfile.dataSecurityRisk = RiskLevel.LOW;
                riskProfile.complianceRisk = RiskLevel.LOW;
                riskProfile.financialRisk = RiskLevel.LOW;
            }
            riskProfile.organization = organization;
            // Handle risk matrix entries if provided
            if (createOrganizationDto.riskMatrix) {
                this.logger.log(`[create] Creating ${createOrganizationDto.riskMatrix.length} risk matrix entries`);
                createOrganizationDto.riskMatrix.forEach(entry => {
                    const riskMatrixEntry = new RiskMatrixEntry();
                    riskMatrixEntry.impact = entry.impact;
                    riskMatrixEntry.likelihood = entry.likelihood;
                    riskMatrixEntry.value = entry.value;
                    riskMatrixEntry.organization = organization;
                    em.persist(riskMatrixEntry);
                });
            }
            // Persist organization and risk profile
            em.persist(organization);
            em.persist(riskProfile);
            await em.flush();
            this.logger.log(`[create] Organization created: ${organization.id}`);
            const userOrg = new UserOrganization();
            userOrg.systemUser = systemUser;
            userOrg.organization = organization;
            userOrg.isActive = true;
            em.persist(userOrg);
            await em.flush();
            this.logger.log(`[create] UserOrganization created: ${userOrg.id}`);
            // Commit transaction
            await em.commit();
            await this.auditLoggingService.logOrganizationActivity(OrganizationAction.CREATED, organization.id, organization.name, systemUser.id, systemUser.email, {
                name: organization.name,
                type: organization.type,
                description: organization.description,
                isActive: organization.isActive,
                isServiceProvider: organization.isServiceProvider,
                primaryContact: organization.primaryContact,
                email: organization.email,
                phone: organization.phone,
                address: organization.address
            }, req);
            // Return organization with populated relations
            return await em.findOne(Organization, { id: organization.id }, {
                populate: ["riskProfile", "riskMatrix"]
            });
        }
        catch (error) {
            this.logger.error(`[create] Error creating organization: ${error.message}`);
            await em.rollback();
            throw error;
        }
    }
    async findAll(userId: string) {
        this.logger.log(`[findAll] Finding user: ${userId}`);
        const systemUser = await this.em.findOne(SystemUser, { id: userId });
        if (systemUser) {
            this.logger.log(`[findAll] Found system user with role: ${systemUser.role}`);
            // System users (GLOBAL_ADMIN and ADMIN)
            if (systemUser.role === SystemRole.GLOBAL_ADMIN) {
                this.logger.log("[findAll] User is GLOBAL_ADMIN, finding all organizations");
                const orgs = await this.em.find(Organization, {}, {
                    populate: ["riskProfile", "riskMatrix"]
                });
                this.logger.log(`[findAll] Found ${orgs.length} organizations`);
                return orgs;
            }
            // For ADMIN and other roles, find their assigned organizations with populated data
            this.logger.log("[findAll] Finding organizations through UserOrganization");
            const userOrgs = await this.em.find(UserOrganization, { systemUser }, {
                populate: ["organization.riskProfile", "organization.riskMatrix"]
            });
            this.logger.log(`[findAll] Found ${userOrgs.length} organizations for system user`);
            return userOrgs.map(uo => uo.organization);
        }
        // Check if it's a client user
        this.logger.log(`[findAll] Finding client user: ${userId}`);
        const clientUser = await this.em.findOne(ClientUser, { id: userId });
        if (clientUser) {
            this.logger.log("[findAll] Finding organizations through UserOrganization for client user");
            const userOrgs = await this.em.find(UserOrganization, { clientUser }, {
                populate: ["organization.riskProfile", "organization.riskMatrix"]
            });
            this.logger.log(`[findAll] Found ${userOrgs.length} organizations for client user`);
            return userOrgs.map(uo => uo.organization);
        }
        this.logger.error(`[findAll] No user found with ID: ${userId}`);
        throw new UnauthorizedException("User not found");
    }
    async findOne(id: string, userId: string) {
        this.logger.log(`[findOne] Finding organization: ${id}`);
        const organization = await this.em.findOne(Organization, { id }, {
            populate: ["riskProfile", "riskMatrix"]
        });
        if (!organization) {
            this.logger.warn(`[findOne] Organization not found: ${id}`);
            return null;
        }
        this.logger.log(`[findOne] Finding system user: ${userId}`);
        const systemUser = await this.em.findOne(SystemUser, { id: userId });
        if (systemUser) {
            this.logger.log(`[findOne] Found system user with role: ${systemUser.role}`);
            // System users (GLOBAL_ADMIN and ADMIN)
            if (systemUser.role === SystemRole.GLOBAL_ADMIN) {
                this.logger.log("[findOne] User is GLOBAL_ADMIN, returning organization");
                return organization;
            }
            const userOrg = await this.em.findOne(UserOrganization, {
                systemUser,
                organization,
            });
            if (!userOrg) {
                this.logger.error(`[findOne] User ${userId} not authorized for organization ${id}`);
                throw new UnauthorizedException("User not authorized for this organization");
            }
            return organization;
        }
        // Check if it's a client user
        this.logger.log(`[findOne] Finding client user: ${userId}`);
        const clientUser = await this.em.findOne(ClientUser, { id: userId });
        if (clientUser) {
            const userOrg = await this.em.findOne(UserOrganization, {
                clientUser,
                organization,
            });
            if (!userOrg) {
                this.logger.error(`[findOne] Client user ${userId} not authorized for organization ${id}`);
                throw new UnauthorizedException("User not authorized for this organization");
            }
            return organization;
        }
        this.logger.error(`[findOne] No user found with ID: ${userId}`);
        throw new UnauthorizedException("User not found");
    }
    async update(id: string, updateOrganizationDto: UpdateOrganizationDto, userId: string, req: Request) {
        // Fork the EntityManager to create a new context for the transaction
        const em = this.em.fork();
        try {
            this.logger.log(`[update] Finding system user: ${userId}`);
            const systemUser = await em.findOne(SystemUser, { id: userId });
            if (!systemUser) {
                this.logger.error(`[update] System user not found: ${userId}`);
                throw new UnauthorizedException("User not found");
            }
            this.logger.log(`[update] Finding organization: ${id}`);
            const organization = await em.findOne(Organization, { id }, {
                populate: ["riskMatrix", "riskProfile"]
            });
            if (!organization) {
                this.logger.warn(`[update] Organization not found: ${id}`);
                return null;
            }
            // Check if user has access to this organization
            if (systemUser.role !== SystemRole.GLOBAL_ADMIN) {
                const userOrg = await em.findOne(UserOrganization, {
                    systemUser,
                    organization,
                });
                if (!userOrg) {
                    this.logger.error(`[update] User ${userId} not authorized for organization ${id}`);
                    throw new UnauthorizedException("User not authorized for this organization");
                }
            }
            const changes = {
                before: {
                    name: organization.name,
                    type: organization.type,
                    description: organization.description,
                    isActive: organization.isActive,
                    isServiceProvider: organization.isServiceProvider,
                    primaryContact: organization.primaryContact,
                    email: organization.email,
                    phone: organization.phone,
                    address: organization.address
                },
                after: null as any
            };
            // Begin transaction
            await em.begin();
            // Handle risk matrix entries if provided
            if (updateOrganizationDto.riskMatrix) {
                // First, remove all existing risk matrix entries for this organization
                this.logger.log(`[update] Removing existing risk matrix entries for organization: ${id}`);
                await em.nativeDelete(RiskMatrixEntry, { organization: { id } });
                await em.flush();
                // Then create new entries
                this.logger.log(`[update] Creating ${updateOrganizationDto.riskMatrix.length} new risk matrix entries`);
                const newEntries = updateOrganizationDto.riskMatrix.map(entry => {
                    const riskMatrixEntry = new RiskMatrixEntry();
                    riskMatrixEntry.impact = entry.impact;
                    riskMatrixEntry.likelihood = entry.likelihood;
                    riskMatrixEntry.value = entry.value;
                    riskMatrixEntry.organization = organization;
                    return riskMatrixEntry;
                });
                // Persist all new entries at once
                em.persist(newEntries);
                await em.flush();
            }
            // Update risk profile if provided
            if (updateOrganizationDto.riskProfile) {
                this.logger.log(`[update] Updating risk profile for organization: ${id}`);
                const riskProfile = await em.findOne(RiskProfile, { organization: { id } });
                if (riskProfile) {
                    wrap(riskProfile).assign(updateOrganizationDto.riskProfile);
                    await em.flush();
                }
            }
            this.logger.log(`[update] Updating organization: ${id}`);
            // Only update non-risk matrix fields
            const { riskMatrix, riskProfile, ...updateFields } = updateOrganizationDto;
            wrap(organization).assign(updateFields, { em });
            await em.flush();
            // Commit transaction
            await em.commit();
            // Fetch the updated organization with populated relations
            const updatedOrganization = await em.findOne(Organization, { id }, {
                populate: ["riskProfile", "riskMatrix"]
            });
            changes.after = {
                name: organization.name,
                type: organization.type,
                description: organization.description,
                isActive: organization.isActive,
                isServiceProvider: organization.isServiceProvider,
                primaryContact: organization.primaryContact,
                email: organization.email,
                phone: organization.phone,
                address: organization.address
            };
            // Log the update
            await this.auditLoggingService.logOrganizationActivity(OrganizationAction.UPDATED, organization.id, organization.name, systemUser.id, systemUser.email, changes, req);
            return updatedOrganization;
        }
        catch (error) {
            this.logger.error(`[update] Error updating organization: ${error.message}`);
            await em.rollback();
            throw error;
        }
    }
    async remove(id: string, userId: string) {
        this.logger.log(`[remove] Finding system user: ${userId}`);
        const systemUser = await this.em.findOne(SystemUser, { id: userId });
        if (!systemUser) {
            this.logger.error(`[remove] System user not found: ${userId}`);
            throw new UnauthorizedException("User not found");
        }
        if (systemUser.role !== SystemRole.GLOBAL_ADMIN) {
            this.logger.error(`[remove] User ${userId} is not a GLOBAL_ADMIN`);
            throw new UnauthorizedException("Only global admins can delete organizations");
        }
        this.logger.log(`[remove] Finding organization: ${id}`);
        const organization = await this.em.findOne(Organization, { id });
        if (!organization) {
            this.logger.warn(`[remove] Organization not found: ${id}`);
            return null;
        }
        await this.em.removeAndFlush(organization);
        this.logger.log(`[remove] Organization removed: ${id}`);
        return organization;
    }
    async addUser(organizationId: string, userEmail: string, adminUserId: string) {
        this.logger.log(`[addUser] Finding admin user: ${adminUserId}`);
        const adminUser = await this.em.findOne(SystemUser, { id: adminUserId });
        if (!adminUser || adminUser.role !== SystemRole.GLOBAL_ADMIN) {
            this.logger.error(`[addUser] User ${adminUserId} is not a GLOBAL_ADMIN`);
            throw new UnauthorizedException("Only global admins can add users to organizations");
        }
        this.logger.log(`[addUser] Finding organization: ${organizationId}`);
        const organization = await this.em.findOne(Organization, { id: organizationId });
        if (!organization) {
            this.logger.error(`[addUser] Organization not found: ${organizationId}`);
            throw new UnauthorizedException("Organization not found");
        }
        // Try to find user in both system and client users
        this.logger.log(`[addUser] Finding user by email: ${userEmail}`);
        const systemUser = await this.em.findOne(SystemUser, { email: userEmail });
        const clientUser = await this.em.findOne(ClientUser, { email: userEmail });
        if (!systemUser && !clientUser) {
            this.logger.error(`[addUser] No user found with email: ${userEmail}`);
            throw new UnauthorizedException("User not found");
        }
        // Check if user is already in organization
        this.logger.log(`[addUser] Checking if user already exists in organization`);
        let existingUserOrg;
        if (systemUser) {
            existingUserOrg = await this.em.findOne(UserOrganization, {
                systemUser,
                organization
            });
        }
        else if (clientUser) {
            existingUserOrg = await this.em.findOne(UserOrganization, {
                clientUser,
                organization
            });
        }
        if (existingUserOrg) {
            this.logger.error(`[addUser] User ${userEmail} is already in organization ${organizationId}`);
            throw new UnauthorizedException("User is already in this organization");
        }
        // Create new UserOrganization instance
        this.logger.log(`[addUser] Creating new UserOrganization`);
        const userOrg = new UserOrganization();
        userOrg.organization = organization;
        // Set either systemUser or clientUser, but not both
        if (systemUser) {
            userOrg.systemUser = systemUser;
            userOrg.clientUser = null;
        }
        else if (clientUser) {
            userOrg.clientUser = clientUser;
            userOrg.systemUser = null;
        }
        userOrg.isActive = true;
        // Begin transaction
        const em = this.em.fork();
        try {
            this.logger.log(`[addUser] Starting transaction`);
            await em.begin();
            await em.persistAndFlush(userOrg);
            await em.commit();
            // Refresh the entity to ensure all relations are properly loaded
            await em.refresh(userOrg);
            this.logger.log(`[addUser] User added successfully: ${userOrg.id}`);
            return userOrg;
        }
        catch (error) {
            this.logger.error(`[addUser] Error adding user: ${error.message}`);
            await em.rollback();
            throw error;
        }
    }
    async removeUser(organizationId: string, userId: string, adminUserId: string) {
        this.logger.log(`[removeUser] Finding admin user: ${adminUserId}`);
        const adminUser = await this.em.findOne(SystemUser, { id: adminUserId });
        if (!adminUser || adminUser.role !== SystemRole.GLOBAL_ADMIN) {
            this.logger.error(`[removeUser] User ${adminUserId} is not a GLOBAL_ADMIN`);
            throw new UnauthorizedException("Only global admins can remove users from organizations");
        }
        this.logger.log(`[removeUser] Finding organization: ${organizationId}`);
        const organization = await this.em.findOne(Organization, { id: organizationId });
        if (!organization) {
            this.logger.error(`[removeUser] Organization not found: ${organizationId}`);
            throw new UnauthorizedException("Organization not found");
        }
        // Try to find user in both system and client users
        this.logger.log(`[removeUser] Finding user: ${userId}`);
        const systemUser = await this.em.findOne(SystemUser, { id: userId });
        const clientUser = await this.em.findOne(ClientUser, { id: userId });
        if (!systemUser && !clientUser) {
            this.logger.error(`[removeUser] No user found with ID: ${userId}`);
            throw new UnauthorizedException("User not found");
        }
        // Find user organization relationship
        this.logger.log(`[removeUser] Finding UserOrganization relationship`);
        const userOrg = await this.em.findOne(UserOrganization, {
            $or: [
                { systemUser: systemUser || null, organization },
                { clientUser: clientUser || null, organization }
            ]
        });
        if (!userOrg) {
            this.logger.error(`[removeUser] User ${userId} is not in organization ${organizationId}`);
            throw new UnauthorizedException("User is not in this organization");
        }
        await this.em.removeAndFlush(userOrg);
        this.logger.log(`[removeUser] User removed from organization: ${userOrg.id}`);
        return userOrg;
    }
}
