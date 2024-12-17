import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SystemUser } from './src/entities/system-user.entity';
import { ClientUser } from './src/entities/client-user.entity';
import { Organization } from './src/entities/organization.entity';
import { UserOrganization } from './src/entities/user-organization.entity';
import { Asset } from './src/entities/asset.entity';
import { Approval } from './src/entities/approval.entity';
import { Incident } from './src/entities/incident.entity';
import { AuditLog } from './src/entities/audit-log.entity';
import { RiskProfile } from './src/entities/risk-profile.entity';
import { RiskMatrixEntry } from './src/entities/risk-matrix-entry.entity';
import { System } from './src/entities/system.entity';
import { Document } from './src/entities/document.entity';
import { ArtifactRevision } from './src/entities/artifact-revision.entity';
import { Artifact } from './src/entities/artifact.entity';
import { ControlArtifact } from './src/entities/control-artifact.entity';
import { ControlAssessment } from './src/entities/control-assessment.entity';
import { ContinuityPlan } from './src/entities/continuity-plan.entity';
import { ATOPackage } from './src/entities/ato-package.entity';
import { MitigationPriority } from './src/entities/mitigation-priority.entity';
import { POAM } from './src/entities/poam.entity';
import { PortMapping } from './src/entities/port-mapping.entity';
import { QuantitativeRisk } from './src/entities/quantitative-risk.entity';
import { ServiceProviderClient } from './src/entities/service-provider-client.entity';
import { Catalog } from './src/entities/catalog.entity';
import { Group } from './src/entities/group.entity';
import { Control } from './src/entities/control.entity';
import { Parameter } from './src/entities/parameter.entity';
import { Part } from './src/entities/part.entity';

export default defineConfig({
    dbName: "securecenter_v1",
    host: "localhost",
    port: 5432,
    user: process.env.POSTGRES_USER || "securecenter_admin",
    password: process.env.POSTGRES_PASSWORD || "your43iuo4buornio3qr4n4io3qfnio43q",
    entities: [
        SystemUser,
        ClientUser,
        Organization,
        UserOrganization,
        Asset,
        Approval,
        Incident,
        AuditLog,
        RiskProfile,
        RiskMatrixEntry,
        System,
        Document,
        ArtifactRevision,
        Artifact,
        ControlArtifact,
        ControlAssessment,
        ContinuityPlan,
        ATOPackage,
        MitigationPriority,
        POAM,
        PortMapping,
        QuantitativeRisk,
        ServiceProviderClient,
        // OSCAL entities
        Catalog,
        Group,
        Control,
        Parameter,
        Part,
    ],
    metadataProvider: TsMorphMetadataProvider,
    migrations: {
        path: "./src/migrations",
        glob: "!(*.d).{js,ts}",
    },
    seeder: {
        path: "./src/seeders",
        defaultSeeder: "DatabaseSeeder",
        glob: "!(*.d).{js,ts}",
    },
    debug: process.env.NODE_ENV !== "production",
});
