import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from '@mikro-orm/postgresql';
import * as bcrypt from 'bcrypt';
import { ClientUser } from '../entities/client-user.entity';
import { Organization } from '../entities/organization.entity';
import { UserOrganization } from '../entities/user-organization.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ClientRole } from '../common/enums/client-role.enum';
import { OrganizationRole } from '../common/enums/organization-role.enum';
@Injectable()
export class ClientAuthService {
    constructor(private readonly em: EntityManager, private readonly jwtService: JwtService) { }
    private async validateUser(email: string, password: string): Promise<ClientUser | null> {
        console.log("[ClientAuthService] Validating user:", { email });
        const user = await this.em.findOne(ClientUser, { email }, { populate: ["organization"] });
        if (user && await bcrypt.compare(password, user.password)) {
            console.log("[ClientAuthService] User validated successfully:", {
                userId: user.id,
                organizationId: user.organization?.id
            });
            return user;
        }
        console.log("[ClientAuthService] User validation failed");
        return null;
    }
    async getProfile(user: any) {
        console.log("[ClientAuthService] Getting profile for user:", { userId: user.id });
        const clientUser = await this.em.findOne(ClientUser, { id: user.id }, { populate: ["organization"] });
        if (!clientUser) {
            console.error("[ClientAuthService] User not found:", { userId: user.id });
            throw new UnauthorizedException("User not found");
        }
        console.log("[ClientAuthService] Profile retrieved successfully:", {
            userId: clientUser.id,
            organizationId: clientUser.organization?.id
        });
        return {
            id: clientUser.id,
            email: clientUser.email,
            firstName: clientUser.firstName,
            lastName: clientUser.lastName,
            isActive: clientUser.isActive,
            lastLogin: clientUser.lastLogin,
            type: "client",
            clientRole: clientUser.clientRole,
            organizationRole: clientUser.organizationRole,
            organization: clientUser.organization ? {
                id: clientUser.organization.id,
                name: clientUser.organization.name
            } : null
        };
    }
    async login(loginDto: LoginDto) {
        console.log("[ClientAuthService] Login attempt:", { email: loginDto.email });
        // Fork EntityManager for transaction
        const em = this.em.fork();
        try {
            // Begin transaction
            await em.begin();
            const user = await this.validateUser(loginDto.email, loginDto.password);
            if (!user) {
                console.error("[ClientAuthService] Invalid credentials:", { email: loginDto.email });
                throw new UnauthorizedException("Invalid credentials");
            }
            if (!user.isActive) {
                console.error("[ClientAuthService] Inactive user attempted login:", {
                    userId: user.id,
                    email: user.email
                });
                throw new UnauthorizedException("User account is inactive");
            }
            if (!user.organization) {
                console.error("[ClientAuthService] User has no organization:", {
                    userId: user.id,
                    email: user.email
                });
                throw new UnauthorizedException("User is not associated with any organization");
            }
            // Check if UserOrganization relationship exists
            const userOrg = await em.findOne(UserOrganization, {
                clientUser: user,
                organization: user.organization
            });
            // Create UserOrganization relationship if it doesn't exist
            if (!userOrg) {
                console.log("[ClientAuthService] Creating missing UserOrganization relationship:", {
                    userId: user.id,
                    organizationId: user.organization.id
                });
                const newUserOrg = new UserOrganization();
                newUserOrg.clientUser = user;
                newUserOrg.organization = user.organization;
                newUserOrg.isActive = true;
                await em.persist(newUserOrg);
            }
            // Include essential security information in the token
            const payload = {
                sub: user.id,
                email: user.email,
                type: "client",
                organizationId: user.organization.id,
                clientRole: user.clientRole,
                organizationRole: user.organizationRole
            };
            // Update last login
            user.lastLogin = new Date();
            await em.persist(user);
            // Commit transaction
            await em.flush();
            await em.commit();
            console.log("[ClientAuthService] Login successful:", {
                userId: user.id,
                organizationId: user.organization.id
            });
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isActive: user.isActive,
                    lastLogin: user.lastLogin,
                    type: "client",
                    clientRole: user.clientRole,
                    organizationRole: user.organizationRole,
                    organizationId: user.organization.id,
                    organization: {
                        id: user.organization.id,
                        name: user.organization.name
                    }
                },
            };
        }
        catch (error) {
            console.error("[ClientAuthService] Login failed:", error);
            await em.rollback();
            throw error;
        }
    }
    async register(registerDto: RegisterDto) {
        console.log("[ClientAuthService] Registration attempt:", {
            email: registerDto.email,
            organizationId: registerDto.organizationId
        });
        // Fork EntityManager for transaction
        const em = this.em.fork();
        try {
            // Begin transaction
            await em.begin();
            const existingUser = await em.findOne(ClientUser, { email: registerDto.email });
            if (existingUser) {
                console.error("[ClientAuthService] Email already exists:", { email: registerDto.email });
                throw new UnauthorizedException("Email already exists");
            }
            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            const user = new ClientUser();
            user.email = registerDto.email;
            user.password = hashedPassword;
            user.firstName = registerDto.firstName;
            user.lastName = registerDto.lastName;
            user.isActive = true;
            // Set default roles for new client users
            user.clientRole = ClientRole.USER;
            user.organizationRole = null;
            await em.persist(user);
            let organization: Organization | null = null;
            if (registerDto.organizationId) {
                organization = await em.findOne(Organization, { id: registerDto.organizationId });
                if (organization) {
                    // Set organization on user
                    user.organization = organization;
                    await em.persist(user);
                    // Create UserOrganization relationship
                    const userOrg = new UserOrganization();
                    userOrg.clientUser = user;
                    userOrg.organization = organization;
                    userOrg.isActive = true;
                    await em.persist(userOrg);
                }
            }
            // Commit transaction
            await em.flush();
            await em.commit();
            const payload = {
                sub: user.id,
                email: user.email,
                type: "client",
                organizationId: organization?.id,
                clientRole: user.clientRole,
                organizationRole: user.organizationRole
            };
            console.log("[ClientAuthService] Registration successful:", {
                userId: user.id,
                organizationId: organization?.id
            });
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isActive: user.isActive,
                    type: "client",
                    clientRole: user.clientRole,
                    organizationRole: user.organizationRole,
                    organization: organization ? {
                        id: organization.id,
                        name: organization.name
                    } : null
                },
            };
        }
        catch (error) {
            console.error("[ClientAuthService] Registration failed:", error);
            await em.rollback();
            throw error;
        }
    }
}
