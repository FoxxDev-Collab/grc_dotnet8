import { SystemRole } from '../../common/enums/system-role.enum';
export interface UserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: SystemRole;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}
