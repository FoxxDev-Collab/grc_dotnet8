import { Entity, Property, Enum, OneToMany, Collection, OneToOne } from '@mikro-orm/core';
import { OrgType } from '../enums/organization.enum';
import { BaseEntity } from './base.entity';
import { RiskProfile } from './risk-profile.entity';
import { QuantitativeRisk } from './quantitative-risk.entity';
import { RiskMatrixEntry } from './risk-matrix-entry.entity';
import { MitigationPriority } from './mitigation-priority.entity';
@Entity()
export class Organization extends BaseEntity {
    @Property()
    name!: string;
    @Enum(() => OrgType)
    type!: OrgType;
    @Property({ nullable: true })
    description?: string;
    @Property()
    isActive: boolean = true;
    @Property()
    isServiceProvider: boolean = false;
    // Contact Information
    @Property({ nullable: true })
    primaryContact?: string;
    @Property({ nullable: true })
    email?: string;
    @Property({ nullable: true })
    phone?: string;
    @Property({ nullable: true })
    address?: string;
    // Risk Management Relations
    @OneToOne(() => RiskProfile, rp => rp.organization, {
        nullable: true,
        orphanRemoval: true
    })
    riskProfile?: RiskProfile;
    @OneToMany(() => QuantitativeRisk, qr => qr.organization, {
        orphanRemoval: true
    })
    quantitativeRisks = new Collection<QuantitativeRisk>(this);
    @OneToMany(() => RiskMatrixEntry, rme => rme.organization, {
        orphanRemoval: true
    })
    riskMatrix = new Collection<RiskMatrixEntry>(this);
    @OneToMany(() => MitigationPriority, mp => mp.organization, {
        orphanRemoval: true
    })
    mitigationPriorities = new Collection<MitigationPriority>(this);
    // Other Relations
    @OneToMany("UserOrganization", "organization", {
        orphanRemoval: true
    })
    users = new Collection<any>(this);
    @OneToMany("ServiceProviderClient", "provider", {
        orphanRemoval: true
    })
    clients = new Collection<any>(this);
    @OneToMany("ServiceProviderClient", "client", {
        orphanRemoval: true
    })
    providers = new Collection<any>(this);
    @OneToMany("System", "organization", {
        orphanRemoval: true
    })
    systems = new Collection<any>(this);
    @OneToMany("Incident", "organization", {
        orphanRemoval: true
    })
    incidents = new Collection<any>(this);
    @OneToMany("ContinuityPlan", "organization", {
        orphanRemoval: true
    })
    continuityPlans = new Collection<any>(this);
    @OneToMany("POAM", "organization", {
        orphanRemoval: true
    })
    poams = new Collection<any>(this);
    @OneToMany("AuditLog", "organization", {
        orphanRemoval: true
    })
    auditLogs = new Collection<any>(this);
    @OneToMany("Artifact", "organization", {
        orphanRemoval: true
    })
    artifacts = new Collection<any>(this);
}
