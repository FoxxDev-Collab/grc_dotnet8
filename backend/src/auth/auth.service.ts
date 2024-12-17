import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from '@mikro-orm/postgresql';
import * as bcrypt from 'bcrypt';
import { SystemUser } from '../entities/system-user.entity';
import { ClientUser } from '../entities/client-user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SystemRole } from '../common/enums/system-role.enum';
import { Organization } from '../entities/organization.entity';
import { UserOrganization } from '../entities/user-organization.entity';
@Injectable()
export class AuthService {
    constructor(private readonly em: EntityManager, private readonly jwtService: JwtService) { }
    async validateSystemUser(email: string, password: string): Promise<SystemUser | null> {
        const user = await this.em.findOne(SystemUser, { email });
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
    async validateClientUser(email: string, password: string): Promise<ClientUser | null> {
        const user = await this.em.findOne(ClientUser, { email }, { populate: ["organization"] });
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
    async validateAdmin(email: string): Promise<boolean> {
        const user = await this.em.findOne(SystemUser, { email });
        if (!user || ![SystemRole.GLOBAL_ADMIN, SystemRole.ADMIN].includes(user.role)) {
            return false;
        }
        return true;
    }
    async getProfile(user: any) {
        if (user.type === "client") {
            const clientUser = await this.em.findOne(ClientUser, { id: user.id }, { populate: ["organization"] });
            if (!clientUser) {
                throw new UnauthorizedException("User not found");
            }
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
                organization: {
                    id: clientUser.organization.id,
                    name: clientUser.organization.name
                }
            };
        }
        else {
            const systemUser = await this.em.findOne(SystemUser, { id: user.id });
            if (!systemUser) {
                throw new UnauthorizedException("User not found");
            }
            return {
                id: systemUser.id,
                email: systemUser.email,
                firstName: systemUser.firstName,
                lastName: systemUser.lastName,
                role: systemUser.role,
                isActive: systemUser.isActive,
                lastLogin: systemUser.lastLogin,
                type: "system"
            };
        }
    }
    async login(loginDto: LoginDto) {
        const systemUser = await this.validateSystemUser(loginDto.email, loginDto.password);
        if (systemUser) {
            if (!systemUser.isActive) {
                throw new UnauthorizedException("User account is inactive");
            }
            const payload = {
                sub: systemUser.id,
                email: systemUser.email,
                role: systemUser.role,
                type: "system"
            };
            // Update last login
            systemUser.lastLogin = new Date();
            await this.em.persistAndFlush(systemUser);
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: systemUser.id,
                    email: systemUser.email,
                    firstName: systemUser.firstName,
                    lastName: systemUser.lastName,
                    role: systemUser.role,
                    isActive: systemUser.isActive,
                    lastLogin: systemUser.lastLogin,
                    type: "system"
                },
            };
        }
        // Try client login if system login fails
        const clientUser = await this.validateClientUser(loginDto.email, loginDto.password);
        if (clientUser) {
            if (!clientUser.isActive) {
                throw new UnauthorizedException("User account is inactive");
            }
            if (!clientUser.organization) {
                throw new UnauthorizedException("User is not associated with any organization");
            }
            // Include essential security information in the token
            const payload = {
                sub: clientUser.id,
                email: clientUser.email,
                type: "client",
                organizationId: clientUser.organization.id,
                clientRole: clientUser.clientRole,
                organizationRole: clientUser.organizationRole
            };
            // Update last login
            clientUser.lastLogin = new Date();
            await this.em.persistAndFlush(clientUser);
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: clientUser.id,
                    email: clientUser.email,
                    firstName: clientUser.firstName,
                    lastName: clientUser.lastName,
                    isActive: clientUser.isActive,
                    lastLogin: clientUser.lastLogin,
                    type: "client",
                    clientRole: clientUser.clientRole,
                    organizationRole: clientUser.organizationRole,
                    organization: {
                        id: clientUser.organization.id,
                        name: clientUser.organization.name
                    }
                },
            };
        }
        throw new UnauthorizedException("Invalid credentials");
    }
    async registerAdmin(registerDto: RegisterDto) {
        const existingUser = await this.em.findOne(SystemUser, { email: registerDto.email });
        if (existingUser) {
            throw new UnauthorizedException("Email already exists");
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = new SystemUser();
        user.email = registerDto.email;
        user.password = hashedPassword;
        user.firstName = registerDto.firstName;
        user.lastName = registerDto.lastName;
        user.role = registerDto.role || SystemRole.ADMIN;
        user.isActive = true;
        await this.em.persistAndFlush(user);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            type: "system"
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
                type: "system"
            },
        };
    }
    async registerClient(registerDto: RegisterDto) {
        const existingUser = await this.em.findOne(ClientUser, { email: registerDto.email });
        if (existingUser) {
            throw new UnauthorizedException("Email already exists");
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = new ClientUser();
        user.email = registerDto.email;
        user.password = hashedPassword;
        user.firstName = registerDto.firstName;
        user.lastName = registerDto.lastName;
        user.isActive = true;
        await this.em.persistAndFlush(user);
        if (registerDto.organizationId) {
            const organization = await this.em.findOne(Organization, { id: registerDto.organizationId });
            if (organization) {
                user.organization = organization;
                await this.em.persistAndFlush(user);
            }
        }
        const payload = {
            sub: user.id,
            email: user.email,
            type: "client",
            organizationId: registerDto.organizationId
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isActive: user.isActive,
                type: "client",
                organization: registerDto.organizationId ? { id: registerDto.organizationId } : null
            },
        };
    }
}
