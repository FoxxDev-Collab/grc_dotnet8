import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class SystemJwtStrategy extends PassportStrategy(Strategy, "system-jwt") {
    private readonly logger = new Logger("SystemJwtStrategy");
    constructor(private configService: ConfigService) {
        const jwtSecret = configService.get<string>("JWT_SECRET");
        if (!jwtSecret) {
            const error = "JWT_SECRET is not configured";
            console.error("[SystemJwtStrategy] Configuration error:", {
                error,
                timestamp: new Date().toISOString()
            });
            throw new Error(error);
        }
        console.log("[SystemJwtStrategy] Initializing with configuration:", {
            jwtFromRequest: "Bearer token from Authorization header",
            ignoreExpiration: false,
            secretConfigured: !!jwtSecret,
            timestamp: new Date().toISOString()
        });
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }
    async validate(payload: any) {
        console.log("[SystemJwtStrategy] Validating JWT payload:", {
            sub: payload.sub,
            email: payload.email,
            type: payload.type,
            role: payload.role,
            timestamp: new Date().toISOString()
        });
        // Only process system user tokens
        if (payload.type !== "system") {
            const error = `Invalid token type: ${payload.type}`;
            console.warn("[SystemJwtStrategy] Validation failed:", {
                error,
                payload: {
                    sub: payload.sub,
                    type: payload.type,
                },
                timestamp: new Date().toISOString()
            });
            this.logger.warn(error);
            return null;
        }
        if (!payload.role) {
            const error = "Token missing system role";
            console.warn("[SystemJwtStrategy] Validation failed:", {
                error,
                payload: {
                    sub: payload.sub,
                    type: payload.type,
                },
                timestamp: new Date().toISOString()
            });
            this.logger.warn(error);
            throw new UnauthorizedException("Invalid token structure");
        }
        const user = {
            id: payload.sub,
            email: payload.email,
            type: payload.type,
            role: payload.role
        };
        console.log("[SystemJwtStrategy] Successfully validated system user:", {
            userId: user.id,
            email: user.email,
            role: user.role,
            timestamp: new Date().toISOString()
        });
        this.logger.log(`Successfully validated system user: ${user.email} with role ${user.role}`);
        return user;
    }
}
