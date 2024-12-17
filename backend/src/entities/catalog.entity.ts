import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Group } from './group.entity';

@Entity()
export class Catalog {
  @PrimaryKey()
  id!: string;

  @Property({ length: 1000 })
  title!: string;

  @Property()
  version!: string;

  @Property()
  lastModified!: Date;

  @OneToMany(() => Group, g => g.catalog)
  groups = new Collection<Group>(this);

  constructor(id: string, title: string, version: string, lastModified: Date) {
    this.id = id;
    this.title = title;
    this.version = version;
    this.lastModified = lastModified;
  }
}
