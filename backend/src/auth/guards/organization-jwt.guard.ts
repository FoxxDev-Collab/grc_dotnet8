import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class OrganizationJwtGuard extends AuthGuard(["client-jwt", "system-jwt"]) {
    private readonly logger = new Logger("OrganizationJwtGuard");
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const route = `${request.method} ${request.url}`;
        console.log("[OrganizationJwtGuard] Authenticating request:", {
            route,
            headers: request.headers,
            timestamp: new Date().toISOString()
        });
        this.logger.debug(`JWT auth check for route: ${route}`);
        return super.canActivate(context);
    }
    handleRequest(err: any, user: any, info: any) {
        // Log authentication attempt details
        console.log("[OrganizationJwtGuard] Authentication attempt:", {
            success: !err && !!user,
            error: err?.message,
            info: info?.message,
            user: user ? {
                id: user.id,
                email: user.email,
                type: user.type,
                organizationId: user.organizationId,
                timestamp: new Date().toISOString()
            } : null
        });
        if (err || !user) {
            const errorMessage = err?.message || "User not found";
            console.log("[OrganizationJwtGuard] Authentication failed:", {
                error: errorMessage,
                stack: err?.stack,
                timestamp: new Date().toISOString()
            });
            this.logger.warn(`Authentication failed: ${errorMessage}`);
            throw err || new UnauthorizedException("Authentication required");
        }
        // Allow system users through without requiring organizationId
        if (user.type === "system") {
            console.log("[OrganizationJwtGuard] System user authenticated:", {
                userId: user.id,
                userEmail: user.email,
                role: user.role,
                timestamp: new Date().toISOString()
            });
            this.logger.log(`System user authenticated: ${user.email} (${user.role})`);
            return user;
        }
        // Ensure organizationId is present for client users
        if (!user.organizationId) {
            const error = "Organization ID not found in token";
            console.log("[OrganizationJwtGuard] Authentication failed:", {
                error,
                userId: user.id,
                userType: user.type,
                timestamp: new Date().toISOString()
            });
            this.logger.warn(error);
            throw new UnauthorizedException(error);
        }
        console.log("[OrganizationJwtGuard] Authentication successful:", {
            userId: user.id,
            userType: user.type,
            userEmail: user.email,
            organizationId: user.organizationId,
            timestamp: new Date().toISOString()
        });
        this.logger.log(`User authenticated successfully: ${user.email} (${user.type})`);
        return user;
    }
}
