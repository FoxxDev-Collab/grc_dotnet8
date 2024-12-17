import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class SystemAuthGuard extends AuthGuard("system-jwt") {
    private readonly logger = new Logger("SystemAuthGuard");
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        this.logger.debug(`System auth check for route: ${request.method} ${request.url}`);
        return super.canActivate(context);
    }
    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            this.logger.warn(`System authentication failed: ${err?.message || "User not found"}`);
            throw err || new UnauthorizedException("System authentication required");
        }
        if (user.type !== "system") {
            this.logger.warn(`Invalid user type attempting system access: ${user.type}`);
            throw new UnauthorizedException("System access denied");
        }
        this.logger.log(`System user authenticated successfully: ${user.email}`);
        return user;
    }
}
