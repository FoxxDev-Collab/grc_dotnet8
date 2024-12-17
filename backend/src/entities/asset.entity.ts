import { Entity, Property, ManyToOne, OneToMany, Collection, ManyToMany } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { System } from './system.entity';
import { ClientUser } from './client-user.entity';
@Entity()
export class Asset extends BaseEntity {
    @ManyToOne(() => System)
    system!: System;
    @Property()
    name!: string;
    @Property()
    type!: string; // Hardware, Software, Service
    @Property()
    status!: string; // Active, Inactive, Retired
    @ManyToOne(() => ClientUser)
    createdBy!: ClientUser;
    @Property({ nullable: true })
    description?: string;
    @Property({ nullable: true })
    version?: string;
    @Property({ nullable: true })
    location?: string;
    @Property({ nullable: true })
    purchaseDate?: Date;
    @Property({ nullable: true })
    endOfLife?: Date;
    // Relations
    @OneToMany("PortMapping", "asset")
    portMappings = new Collection<any>(this);
    @ManyToMany({ entity: "Incident", mappedBy: "affectedAssets" })
    incidents = new Collection<any>(this);
}
