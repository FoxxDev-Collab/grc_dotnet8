import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Organization } from '../entities/organization.entity';
import { OrgType } from '../enums/organization.enum';
import { RiskProfile } from '../entities/risk-profile.entity';
import { RiskLevel } from '../enums/risk.enum';
export class OrganizationSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        // The White Council - Service Provider
        const whiteCouncil = em.create(Organization, {
            name: "The White Council",
            type: OrgType.SERVICE_PROVIDER,
            description: "Ancient order of security practitioners providing oversight and protection across Middle-earth",
            isActive: true,
            isServiceProvider: true,
            primaryContact: "Gandalf the Grey",
            email: "mithrandir@white-council.me",
            phone: "(555) 675-7655",
            address: "Isengard Tower, Middle-earth",
        });
        const whiteCouncilProfile = em.create(RiskProfile, {
            businessFunctions: `
        - Magical Defense Systems
        - Ring Detection & Monitoring
        - Dark Force Prevention
        - Ancient Knowledge Protection
        - Inter-realm Security Coordination
      `,
            keyAssets: `
        - Palantíri Network
        - White Council Archives
        - Elven Ring Management Systems
        - Istari Knowledge Base
        - Ancient Artifact Repository
      `,
            complianceFrameworks: [
                "MIST 800-53 (Middle-earth Institute of Security)",
                "ISO 27001 First Age Edition",
                "Ring Bearer Security Controls",
                "Council of Elrond Protocols",
                "Valar Security Standards"
            ],
            dataTypes: [
                "Ring Bearer PII",
                "Ancient Spells",
                "Magical Artifacts Data",
                "Council Communications",
                "Dark Force Intelligence"
            ],
            operationalRisk: RiskLevel.LOW,
            dataSecurityRisk: RiskLevel.HIGH,
            complianceRisk: RiskLevel.LOW,
            financialRisk: RiskLevel.LOW,
            organization: whiteCouncil
        });
        // Rivendell Data Haven
        const rivendell = em.create(Organization, {
            name: "Rivendell Data Haven",
            type: OrgType.CLIENT,
            description: "Premier facility for the preservation and protection of ancient knowledge and artifacts",
            isActive: true,
            isServiceProvider: false,
            primaryContact: "Elrond",
            email: "elrond@rivendell.me",
            phone: "(555) 454-4532",
            address: "Valley of Imladris, Middle-earth",
        });
        const rivendellProfile = em.create(RiskProfile, {
            businessFunctions: `
        - Ancient Text Digitization
        - Artifact Authentication
        - Lore Preservation
        - Historical Data Analytics
        - Elvish Knowledge Management
      `,
            keyAssets: `
        - Historical Archives
        - Artifact Database
        - Elvish Manuscripts
        - Ancient Maps Repository
        - Healing Knowledge Base
      `,
            complianceFrameworks: [
                "Elvish Data Protection Act",
                "Ancient Knowledge Preservation Standard",
                "First Age Compliance Controls",
                "Ring Bearer Privacy Framework",
                "Council of Elrond Security Protocols"
            ],
            dataTypes: [
                "Ancient Manuscripts",
                "Magical Artifact Specifications",
                "Historical Records",
                "Healing Arts Data",
                "Elvish Lore"
            ],
            operationalRisk: RiskLevel.MEDIUM,
            dataSecurityRisk: RiskLevel.CRITICAL,
            complianceRisk: RiskLevel.HIGH,
            financialRisk: RiskLevel.LOW,
            organization: rivendell
        });
        // Gondor Defense Systems
        const gondor = em.create(Organization, {
            name: "Gondor Defense Systems",
            type: OrgType.CLIENT,
            description: "Leading provider of border security and early warning systems in Middle-earth",
            isActive: true,
            isServiceProvider: false,
            primaryContact: "Boromir",
            email: "captain@gondor.me",
            phone: "(555) 545-3432",
            address: "White Tower, Minas Tirith, Gondor",
        });
        const gondorProfile = em.create(RiskProfile, {
            businessFunctions: `
        - Border Monitoring Systems
        - Beacon Network Management
        - Palantír Communications
        - Troop Deployment Analytics
        - Enemy Movement Detection
      `,
            keyAssets: `
        - Beacon Network Infrastructure
        - Defense Plans Database
        - Troop Movement Tracking System
        - Enemy Intelligence Repository
        - Emergency Response Protocols
      `,
            complianceFrameworks: [
                "Gondorian Military Standards",
                "Beacon Network Security Protocol",
                "Palant\u00EDr Usage Guidelines",
                "Border Defense Framework",
                "Military Intelligence Protection"
            ],
            dataTypes: [
                "Military Intelligence",
                "Troop Movements",
                "Enemy Activity Reports",
                "Defense Plans",
                "Emergency Protocols"
            ],
            operationalRisk: RiskLevel.CRITICAL,
            dataSecurityRisk: RiskLevel.HIGH,
            complianceRisk: RiskLevel.HIGH,
            financialRisk: RiskLevel.MEDIUM,
            organization: gondor
        });
        // Erebor Vault Technologies
        const erebor = em.create(Organization, {
            name: "Erebor Vault Technologies",
            type: OrgType.CLIENT,
            description: "Specialized in high-security storage solutions and access control systems",
            isActive: true,
            isServiceProvider: false,
            primaryContact: "Thorin Oakenshield",
            email: "king@erebor.me",
            phone: "(555) 234-3432",
            address: "Lonely Mountain, Rhovanion",
        });
        const ereborProfile = em.create(RiskProfile, {
            businessFunctions: `
        - Vault Security Systems
        - Dragon Detection Analytics
        - Treasury Management
        - Access Control Solutions
        - Dwarf Authentication Services
      `,
            keyAssets: `
        - Vault Security Grid
        - Treasury Database
        - Mithril Inventory System
        - Access Control Matrix
        - Gem Classification Database
      `,
            complianceFrameworks: [
                "Dwarven Security Standards",
                "Treasury Protection Protocol",
                "Mithril Handling Guidelines",
                "Mountain Access Controls",
                "Gem Classification Framework"
            ],
            dataTypes: [
                "Treasury Records",
                "Mithril Inventory",
                "Access Credentials",
                "Security Patterns",
                "Vault Blueprints"
            ],
            operationalRisk: RiskLevel.HIGH,
            dataSecurityRisk: RiskLevel.CRITICAL,
            complianceRisk: RiskLevel.MEDIUM,
            financialRisk: RiskLevel.HIGH,
            organization: erebor
        });
        // Set up bidirectional relationships
        whiteCouncil.riskProfile = whiteCouncilProfile;
        rivendell.riskProfile = rivendellProfile;
        gondor.riskProfile = gondorProfile;
        erebor.riskProfile = ereborProfile;
        // Persist everything
        await em.persistAndFlush([
            whiteCouncil,
            rivendell,
            gondor,
            erebor,
            whiteCouncilProfile,
            rivendellProfile,
            gondorProfile,
            ereborProfile
        ]);
    }
}
