import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Control } from './control.entity';

@Entity()
export class ControlLink {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => Control)
  sourceControl!: Control;

  @ManyToOne(() => Control)
  targetControl!: Control;

  @Property()
  rel!: string;

  @Property({ nullable: true })
  href!: string;

  constructor(id: string, sourceControl: Control, targetControl: Control, rel: string, href: string) {
    this.id = id;
    this.sourceControl = sourceControl;
    this.targetControl = targetControl;
    this.rel = rel;
    this.href = href;
  }
}
