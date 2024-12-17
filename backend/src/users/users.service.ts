import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { SystemUser } from '../entities/system-user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './types/user.types';
import { SystemRole } from '../common/enums/system-role.enum';
@Injectable()
export class UsersService {
    constructor(private readonly em: EntityManager) { }
    async findAll(): Promise<UserResponse[]> {
        // Only fetch system users (GLOBAL_ADMIN and ADMIN)
        const users = await this.em.find(SystemUser, {
            role: { $in: [SystemRole.GLOBAL_ADMIN, SystemRole.ADMIN] }
        }, {
            fields: [
                "id",
                "email",
                "firstName",
                "lastName",
                "role",
                "isActive",
                "lastLogin",
                "createdAt",
                "updatedAt"
            ]
        });
        return users.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));
    }
    async findOne(id: string): Promise<UserResponse | null> {
        const user = await this.em.findOne(SystemUser, {
            id,
            role: { $in: [SystemRole.GLOBAL_ADMIN, SystemRole.ADMIN] }
        }, {
            fields: [
                "id",
                "email",
                "firstName",
                "lastName",
                "role",
                "isActive",
                "lastLogin",
                "createdAt",
                "updatedAt"
            ]
        });
        if (!user)
            return null;
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
    async findByEmail(email: string): Promise<SystemUser | null> {
        return this.em.findOne(SystemUser, {
            email,
            role: { $in: [SystemRole.GLOBAL_ADMIN, SystemRole.ADMIN] }
        });
    }
    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse | null> {
        const user = await this.em.findOne(SystemUser, {
            id,
            role: { $in: [SystemRole.GLOBAL_ADMIN, SystemRole.ADMIN] }
        });
        if (!user) {
            return null;
        }
        // Ensure we can't change a system user to a client user
        if (updateUserDto.role && updateUserDto.role === SystemRole.USER) {
            throw new UnauthorizedException("Cannot change system user to client user");
        }
        this.em.assign(user, updateUserDto);
        await this.em.persistAndFlush(user);
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
    async remove(id: string): Promise<UserResponse | null> {
        const user = await this.em.findOne(SystemUser, {
            id,
            role: { $in: [SystemRole.GLOBAL_ADMIN, SystemRole.ADMIN] }
        });
        if (!user) {
            return null;
        }
        await this.em.removeAndFlush(user);
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}
