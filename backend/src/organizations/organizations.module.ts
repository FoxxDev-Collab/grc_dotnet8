import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { AuditLoggingService } from './audit-logging.service';
import { Organization } from '../entities/organization.entity';
import { UserOrganization } from '../entities/user-organization.entity';
import { ClientUser } from '../entities/client-user.entity';
import { SystemUser } from '../entities/system-user.entity';
import { System } from '../entities/system.entity';
import { ServiceProviderClient } from '../entities/service-provider-client.entity';
import { RiskProfile } from '../entities/risk-profile.entity';
import { QuantitativeRisk } from '../entities/quantitative-risk.entity';
import { RiskMatrixEntry } from '../entities/risk-matrix-entry.entity';
import { MitigationPriority } from '../entities/mitigation-priority.entity';
import { AuditLog } from '../entities/audit-log.entity';
@Module({
    imports: [
        MikroOrmModule.forFeature([
            Organization,
            UserOrganization,
            ClientUser,
            SystemUser,
            System,
            ServiceProviderClient,
            RiskProfile,
            QuantitativeRisk,
            RiskMatrixEntry,
            MitigationPriority,
            AuditLog
        ])
    ],
    controllers: [OrganizationsController],
    providers: [OrganizationsService, AuditLoggingService],
    exports: [OrganizationsService], // Export the service so it can be used by other modules
})
export class OrganizationsModule {
}
