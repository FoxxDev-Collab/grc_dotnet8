import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ClientJwtStrategy extends PassportStrategy(Strategy, "client-jwt") {
    private readonly logger = new Logger("ClientJwtStrategy");
    constructor(private configService: ConfigService) {
        const jwtSecret = configService.get<string>("JWT_SECRET");
        if (!jwtSecret) {
            const error = "JWT_SECRET is not configured";
            console.error("[ClientJwtStrategy] Configuration error:", {
                error,
                timestamp: new Date().toISOString()
            });
            throw new Error(error);
        }
        console.log("[ClientJwtStrategy] Initializing with configuration:", {
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
        console.log("[ClientJwtStrategy] Validating JWT payload:", {
            sub: payload.sub,
            email: payload.email,
            type: payload.type,
            organizationId: payload.organizationId,
            timestamp: new Date().toISOString()
        });
        // Only process client user tokens
        if (payload.type !== "client") {
            const error = `Invalid token type: ${payload.type}`;
            console.warn("[ClientJwtStrategy] Validation failed:", {
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
        if (!payload.organizationId) {
            const error = "Token missing organizationId";
            console.warn("[ClientJwtStrategy] Validation failed:", {
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
            organizationId: payload.organizationId,
            clientRole: payload.clientRole,
            organizationRole: payload.organizationRole
        };
        console.log("[ClientJwtStrategy] Successfully validated client user:", {
            userId: user.id,
            email: user.email,
            organizationId: user.organizationId,
            roles: {
                client: user.clientRole,
                organization: user.organizationRole
            },
            timestamp: new Date().toISOString()
        });
        this.logger.log(`Successfully validated client user: ${user.email}`);
        return user;
    }
}
