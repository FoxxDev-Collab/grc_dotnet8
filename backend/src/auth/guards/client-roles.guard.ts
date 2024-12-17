import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientRole } from '../../common/enums/client-role.enum';
@Injectable()
export class ClientRolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<ClientRole[]>("clientRoles", context.getHandler());
        if (!requiredRoles) {
            return true; // No roles required
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            return false; // No user
        }
        // Allow system users through - they are handled by the RolesGuard
        if (user.type === "system") {
            return true;
        }
        // Handle client users
        if (user.type === "client") {
            // ADMIN role has full access
            if (user.clientRole === ClientRole.ADMIN) {
                return true;
            }
            // MANAGER can do everything except user management
            if (user.clientRole === ClientRole.MANAGER) {
                // Allow all operations except those requiring ADMIN
                return !requiredRoles.includes(ClientRole.ADMIN);
            }
            // PM and USER are view-only
            if (user.clientRole === ClientRole.PM || user.clientRole === ClientRole.USER) {
                // Only allow if the endpoint doesn't require ADMIN or MANAGER roles
                return !requiredRoles.some(role => [ClientRole.ADMIN, ClientRole.MANAGER].includes(role));
            }
        }
        return false;
    }
}
