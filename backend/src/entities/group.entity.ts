import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { Catalog } from './catalog.entity';
import { Control } from './control.entity';

@Entity()
export class Group {
  @PrimaryKey()
  id!: string;

  @Property({ length: 1000 })
  title!: string;

  @Property({ length: 500 })
  class!: string;

  @ManyToOne(() => Catalog)
  catalog!: Catalog;

  @OneToMany(() => Control, c => c.group)
  controls = new Collection<Control>(this);

  constructor(id: string, title: string, className: string, catalog: Catalog) {
    this.id = id;
    this.title = title;
    this.class = className;
    this.catalog = catalog;
  }
}
