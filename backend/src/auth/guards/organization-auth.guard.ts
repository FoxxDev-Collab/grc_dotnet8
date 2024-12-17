import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CLIENT_ROLES_KEY } from '../decorators/client-roles.decorator';
@Injectable()
export class OrganizationAuthGuard implements CanActivate {
    private readonly logger = new Logger("OrganizationAuthGuard");
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const params = request.params;
        this.logger.debug(`Auth check for route: ${request.method} ${request.url}`);
        this.logger.debug(`User attempting access: ${JSON.stringify({
            id: user?.id,
            type: user?.type,
            organizationId: user?.organizationId,
            clientRole: user?.clientRole,
            organizationRole: user?.organizationRole
        })}`);
        // System users can access all organizations
        if (user?.type === "system") {
            this.logger.log(`System user ${user.id} granted access to organization ${params.organizationId}`);
            return true;
        }
        // If no user or not a client user, deny access
        if (!user || user.type !== "client") {
            this.logger.warn(`Access denied - Invalid or missing user credentials`);
            throw new UnauthorizedException("Access denied");
        }
        // If organizationId from params doesn't match user's organization, deny access
        if (params.organizationId && params.organizationId !== user.organizationId) {
            this.logger.warn(`Access denied - User ${user.id} attempted to access organization ${params.organizationId} but belongs to ${user.organizationId}`);
            throw new UnauthorizedException("Access denied - Invalid organization");
        }
        // Check if user has required client role if specified
        const requiredRoles = this.reflector.get<string[]>(CLIENT_ROLES_KEY, context.getHandler());
        if (requiredRoles) {
            const hasRole = requiredRoles.some(role => role === user.clientRole || role === user.organizationRole);
            if (!hasRole) {
                this.logger.warn(`Access denied - User ${user.id} with roles [${user.clientRole}, ${user.organizationRole}] attempted to access route requiring roles [${requiredRoles.join(", ")}]`);
                throw new UnauthorizedException("Access denied - Insufficient permissions");
            }
            this.logger.log(`Role check passed for user ${user.id} with roles [${user.clientRole}, ${user.organizationRole}]`);
        }
        this.logger.log(`Access granted for user ${user.id} to organization ${params.organizationId}`);
        return true;
    }
}
