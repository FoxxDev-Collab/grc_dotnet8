import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import * as bcrypt from 'bcrypt';
import { SystemUser } from '../entities/system-user.entity';
import { CreateSystemUserDto } from './dto/create-system-user.dto';
import { UpdateSystemUserDto } from './dto/update-system-user.dto';
import { SystemUserResponse } from './types/system-user.types';
import { SystemRole } from '../common/enums/system-role.enum';
@Injectable()
export class SystemUsersService {
    constructor(private readonly em: EntityManager) { }
    private mapToResponse(user: SystemUser): SystemUserResponse {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            organizations: user.organizations.isInitialized() ? user.organizations.getItems() : [],
        };
    }
    async create(createDto: CreateSystemUserDto): Promise<SystemUserResponse> {
        const existingUser = await this.em.findOne(SystemUser, { email: createDto.email });
        if (existingUser) {
            throw new UnauthorizedException("Email already exists");
        }
        const hashedPassword = await bcrypt.hash(createDto.password, 10);
        const user = new SystemUser();
        user.email = createDto.email;
        user.password = hashedPassword;
        user.firstName = createDto.firstName;
        user.lastName = createDto.lastName;
        user.role = createDto.role || SystemRole.ADMIN;
        user.isActive = true;
        await this.em.persistAndFlush(user);
        return this.mapToResponse(user);
    }
    async findAll(): Promise<SystemUserResponse[]> {
        const users = await this.em.find(SystemUser, {}, {
            populate: ["organizations"]
        });
        return users.map(user => this.mapToResponse(user));
    }
    async findOne(id: string): Promise<SystemUserResponse | null> {
        const user = await this.em.findOne(SystemUser, { id }, {
            populate: ["organizations"]
        });
        return user ? this.mapToResponse(user) : null;
    }
    async findByEmail(email: string): Promise<SystemUser | null> {
        return this.em.findOne(SystemUser, { email }, {
            populate: ["organizations"]
        });
    }
    async update(id: string, updateDto: UpdateSystemUserDto): Promise<SystemUserResponse> {
        const user = await this.em.findOne(SystemUser, { id });
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        if (updateDto.password) {
            updateDto.password = await bcrypt.hash(updateDto.password, 10);
        }
        this.em.assign(user, updateDto);
        await this.em.persistAndFlush(user);
        return this.mapToResponse(user);
    }
    async remove(id: string): Promise<SystemUserResponse> {
        const user = await this.em.findOne(SystemUser, { id });
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        await this.em.removeAndFlush(user);
        return this.mapToResponse(user);
    }
    async validateCredentials(email: string, password: string): Promise<SystemUser | null> {
        const user = await this.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
    async updateLastLogin(id: string): Promise<void> {
        const user = await this.em.findOne(SystemUser, { id });
        if (user) {
            user.lastLogin = new Date();
            await this.em.persistAndFlush(user);
        }
    }
}
