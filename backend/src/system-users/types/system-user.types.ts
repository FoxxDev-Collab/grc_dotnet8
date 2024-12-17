import { SystemRole } from '../../common/enums/system-role.enum';
import { UserOrganization } from '../../entities/user-organization.entity';
export interface SystemUserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: SystemRole;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
    organizations: UserOrganization[];
}
export interface SystemUserLoginResponse {
    access_token: string;
    user: SystemUserResponse;
}
