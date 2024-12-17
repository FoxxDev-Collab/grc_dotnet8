import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SystemUsersService } from '../system-users/system-users.service';
import { LoginDto } from './dto/login.dto';
import { CreateSystemUserDto } from '../system-users/dto/create-system-user.dto';
import { SystemRole } from '../common/enums/system-role.enum';
import { SystemUserLoginResponse } from '../system-users/types/system-user.types';
@Injectable()
export class SystemAuthService {
    constructor(private readonly systemUsersService: SystemUsersService, private readonly jwtService: JwtService) { }
    async validateSystemUser(email: string, password: string) {
        const user = await this.systemUsersService.validateCredentials(email, password);
        if (!user) {
            return null;
        }
        // Ensure the user is a system user (GLOBAL_ADMIN or ADMIN)
        if (![SystemRole.GLOBAL_ADMIN, SystemRole.ADMIN].includes(user.role)) {
            return null;
        }
        return user;
    }
    async login(loginDto: LoginDto): Promise<SystemUserLoginResponse> {
        const user = await this.validateSystemUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }
        if (!user.isActive) {
            throw new UnauthorizedException("User account is inactive");
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            type: "system"
        };
        // Update last login
        await this.systemUsersService.updateLastLogin(user.id);
        // Get complete user data including organizations
        const userData = await this.systemUsersService.findOne(user.id);
        if (!userData) {
            throw new UnauthorizedException("User data not found");
        }
        return {
            access_token: this.jwtService.sign(payload),
            user: userData,
        };
    }
    async register(createDto: CreateSystemUserDto): Promise<SystemUserLoginResponse> {
        const user = await this.systemUsersService.create(createDto);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            type: "system"
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }
}
