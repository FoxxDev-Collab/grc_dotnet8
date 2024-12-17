import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { Control } from './control.entity';

@Entity()
export class Part {
  @PrimaryKey()
  id!: string;

  @Property()
  name!: string;

  @Property({ type: 'text', nullable: true })  // Use text type for unlimited length
  prose?: string;

  @ManyToOne(() => Control)
  control!: Control;

  @ManyToOne(() => Part, { nullable: true })
  parent?: Part;

  @OneToMany(() => Part, p => p.parent)
  children = new Collection<Part>(this);

  constructor(id: string, name: string, prose: string, control: Control, parent?: Part) {
    this.id = id;
    this.name = name;
    this.prose = prose;
    this.control = control;
    this.parent = parent;
  }
}
