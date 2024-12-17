import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SystemUsersService } from '../../system-users/system-users.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { ClientUser } from '../../entities/client-user.entity';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly systemUsersService: SystemUsersService, private readonly em: EntityManager) {
        super({
            jwtFromRequest: (req) => {
                const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
                console.log("Extracted Authorization header:", req.headers.authorization);
                console.log("Extracted token:", token);
                return token;
            },
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || "your-secret-key",
        });
    }
    async validate(payload: any) {
        // Handle client users
        console.log("JWT Payload:", payload);
        console.log("Validating JWT payload:", payload);
        if (payload.type === "client") {
            const user = await this.em.findOne(ClientUser, { id: payload.sub });
            if (!user) {
                throw new UnauthorizedException("User not found");
            }
            if (!user.isActive) {
                throw new UnauthorizedException("User is inactive");
            }
            return {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isActive: user.isActive,
                type: "client"
            };
        }
        // Handle system users
        const user = await this.systemUsersService.findOne(payload.sub);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        if (!user.isActive) {
            throw new UnauthorizedException("User is inactive");
        }
        // Verify that the user's role matches the one in the token
        if (user.role !== payload.role) {
            throw new UnauthorizedException("Invalid user role");
        }
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            type: "system"
        };
    }
}
