import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Control } from './control.entity';

@Entity()
export class Parameter {
  @PrimaryKey()
  id!: string;

  @Property({ length: 1000 })
  label!: string;

  @ManyToOne(() => Control)
  control!: Control;

  constructor(id: string, label: string, control: Control) {
    this.id = id;
    this.label = label;
    this.control = control;
  }
}
