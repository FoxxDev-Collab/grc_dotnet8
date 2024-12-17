import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard(["system-jwt", "client-jwt"]) {
    private readonly logger = new Logger("JwtAuthGuard");
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const route = `${request.method} ${request.url}`;
        console.log("[JwtAuthGuard] Authenticating request:", {
            route,
            headers: request.headers,
            timestamp: new Date().toISOString()
        });
        this.logger.debug(`JWT auth check for route: ${route}`);
        return super.canActivate(context);
    }
    handleRequest(err: any, user: any, info: any) {
        // Log authentication attempt details
        console.log("[JwtAuthGuard] Authentication attempt:", {
            success: !err && !!user,
            error: err?.message,
            info: info?.message,
            user: user ? {
                id: user.id,
                email: user.email,
                type: user.type,
                timestamp: new Date().toISOString()
            } : null
        });
        if (err || !user) {
            const errorMessage = err?.message || "User not found";
            console.log("[JwtAuthGuard] Authentication failed:", {
                error: errorMessage,
                stack: err?.stack,
                timestamp: new Date().toISOString()
            });
            this.logger.warn(`Authentication failed: ${errorMessage}`);
            throw err || new UnauthorizedException("Authentication required");
        }
        console.log("[JwtAuthGuard] Authentication successful:", {
            userId: user.id,
            userType: user.type,
            userEmail: user.email,
            timestamp: new Date().toISOString()
        });
        this.logger.log(`User authenticated successfully: ${user.email} (${user.type})`);
        return user;
    }
}
