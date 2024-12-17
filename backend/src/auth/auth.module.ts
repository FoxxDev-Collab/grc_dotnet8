import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SystemAuthController } from './system-auth.controller';
import { ClientAuthController } from './client-auth.controller';
import { SystemAuthService } from './system-auth.service';
import { ClientAuthService } from './client-auth.service';
import { SystemJwtStrategy } from './strategies/system-jwt.strategy';
import { ClientJwtStrategy } from './strategies/client-jwt.strategy';
import { OrganizationAuthGuard } from './guards/organization-auth.guard';
import { ClientAuthGuard } from './guards/client-auth.guard';
import { SystemAuthGuard } from './guards/system-auth.guard';
import { ClientRolesGuard } from './guards/client-roles.guard';
import { OrganizationJwtGuard } from './guards/organization-jwt.guard';
import { SystemUsersModule } from '../system-users/system-users.module';
import { ClientUsersModule } from '../client-users/client-users.module';
@Module({
    imports: [
        // Make ConfigModule available globally
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PassportModule.register({
            defaultStrategy: ["system-jwt", "client-jwt"],
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const secret = configService.get<string>("JWT_SECRET");
                if (!secret) {
                    const error = "JWT_SECRET must be configured";
                    console.error("[AuthModule] Configuration error:", {
                        error,
                        timestamp: new Date().toISOString()
                    });
                    throw new Error(error);
                }
                console.log("[AuthModule] Configuring JWT Module:", {
                    secretConfigured: !!secret,
                    expirationConfigured: !!configService.get<string>("JWT_EXPIRATION"),
                    timestamp: new Date().toISOString()
                });
                return {
                    secret,
                    signOptions: {
                        expiresIn: configService.get<string>("JWT_EXPIRATION") || "1d"
                    },
                };
            },
            inject: [ConfigService],
        }),
        SystemUsersModule,
        ClientUsersModule,
    ],
    controllers: [
        AuthController,
        SystemAuthController,
        ClientAuthController
    ],
    providers: [
        Logger,
        AuthService,
        SystemAuthService,
        ClientAuthService,
        SystemJwtStrategy,
        ClientJwtStrategy,
        OrganizationAuthGuard,
        ClientAuthGuard,
        SystemAuthGuard,
        ClientRolesGuard,
        OrganizationJwtGuard,
        ConfigService,
    ],
    exports: [
        AuthService,
        SystemAuthService,
        ClientAuthService,
        SystemJwtStrategy,
        ClientJwtStrategy,
        OrganizationAuthGuard,
        ClientAuthGuard,
        SystemAuthGuard,
        ClientRolesGuard,
        OrganizationJwtGuard,
    ],
})
export class AuthModule implements OnModuleInit {
    private readonly logger = new Logger("AuthModule");
    constructor(private configService: ConfigService) { }
    onModuleInit() {
        console.log("[AuthModule] Initializing module:", {
            jwtSecret: this.configService.get("JWT_SECRET") ? "Configured" : "Missing",
            jwtExpiration: this.configService.get("JWT_EXPIRATION") || "1d",
            timestamp: new Date().toISOString()
        });
        this.logger.log("Auth module initialized with JWT configuration");
    }
}
