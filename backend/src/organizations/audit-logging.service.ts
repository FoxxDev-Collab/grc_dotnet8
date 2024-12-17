import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { AuditLog } from '../entities/audit-log.entity';
import { OrganizationAction } from '../entities/organization-audit-log.entity';
import { Request } from 'express';
import { Organization } from '../entities/organization.entity';
import { SystemUser } from '../entities/system-user.entity';
interface AuditLogFilter {
    startDate?: Date;
    endDate?: Date;
    actions?: OrganizationAction[];
    performedById?: string;
}
@Injectable()
export class AuditLoggingService {
    constructor(private readonly em: EntityManager) { }
    async logOrganizationActivity(action: OrganizationAction, organizationId: string, organizationName: string, userId: string, userEmail: string, details: any, req: Request) {
        const organization = await this.em.findOne(Organization, { id: organizationId });
        const systemUser = await this.em.findOne(SystemUser, { id: userId });
        if (!organization || !systemUser) {
            throw new Error("Organization or user not found");
        }
        const auditLog = new AuditLog();
        auditLog.entityType = "organization";
        auditLog.entityId = organizationId;
        auditLog.action = action;
        auditLog.details = {
            ...details,
            organizationName,
            userEmail,
        };
        auditLog.ipAddress = req.ip;
        auditLog.userAgent = req.headers["user-agent"];
        auditLog.organization = organization;
        auditLog.systemUser = systemUser;
        await this.em.persistAndFlush(auditLog);
        return auditLog;
    }
    async getOrganizationAuditLogs(organizationId: string, filter: AuditLogFilter) {
        const organization = await this.em.findOne(Organization, { id: organizationId });
        if (!organization) {
            throw new Error("Organization not found");
        }
        const qb = this.em.createQueryBuilder(AuditLog, "al")
            .where({ organization });
        if (filter.startDate) {
            qb.andWhere({ createdAt: { $gte: filter.startDate } });
        }
        if (filter.endDate) {
            qb.andWhere({ createdAt: { $lte: filter.endDate } });
        }
        if (filter.actions?.length) {
            qb.andWhere({ action: { $in: filter.actions } });
        }
        if (filter.performedById) {
            const systemUser = await this.em.findOne(SystemUser, { id: filter.performedById });
            if (systemUser) {
                qb.andWhere({ systemUser });
            }
        }
        return qb.orderBy({ createdAt: "DESC" }).getResult();
    }
}
