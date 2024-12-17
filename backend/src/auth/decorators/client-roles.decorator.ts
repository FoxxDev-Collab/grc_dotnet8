import { SetMetadata } from '@nestjs/common';
import { ClientRole } from '../../common/enums/client-role.enum';
export const CLIENT_ROLES_KEY = "clientRoles";
export const ClientRoles = (...roles: ClientRole[]) => SetMetadata(CLIENT_ROLES_KEY, roles);
// Helper function to check if a role has specific permissions
export function hasPermission(userRole: ClientRole, requiredRole: ClientRole): boolean {
    // Role hierarchy from highest to lowest
    const roleHierarchy = [
        ClientRole.ADMIN, // Full control
        ClientRole.MANAGER, // Can edit org but not users
        ClientRole.PM, // View only all
        ClientRole.USER // View only specific
    ];
    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
    // Lower index means higher permission level
    return userRoleIndex <= requiredRoleIndex;
}
// Example usage:
// @ClientRoles(ClientRole.ADMIN)                    // Only ADMIN
// @ClientRoles(ClientRole.ADMIN, ClientRole.MANAGER) // ADMIN or MANAGER
// @ClientRoles(ClientRole.PM)                       // ADMIN, MANAGER, or PM can access
