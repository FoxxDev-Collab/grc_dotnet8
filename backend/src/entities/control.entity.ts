import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { Group } from './group.entity';
import { Part } from './part.entity';
import { Parameter } from './parameter.entity';
import { ControlLink } from './control-link.entity';

@Entity()
export class Control {
  @PrimaryKey()
  id!: string;

  @Property({ length: 1000 })
  title!: string;

  @Property({ length: 500 })
  class!: string;

  @ManyToOne(() => Group)
  group!: Group;

  @ManyToOne(() => Control, { nullable: true })
  baseControl?: Control;

  @OneToMany(() => Control, control => control.baseControl)
  enhancements = new Collection<Control>(this);

  @OneToMany(() => Part, p => p.control)
  parts = new Collection<Part>(this);

  @OneToMany(() => Parameter, p => p.control)
  parameters = new Collection<Parameter>(this);

  @OneToMany(() => ControlLink, link => link.sourceControl)
  outgoingLinks = new Collection<ControlLink>(this);

  @OneToMany(() => ControlLink, link => link.targetControl)
  incomingLinks = new Collection<ControlLink>(this);

  constructor(id: string, title: string, className: string, group: Group, baseControl?: Control) {
    this.id = id;
    this.title = title;
    this.class = className;
    this.group = group;
    if (baseControl) {
      this.baseControl = baseControl;
    }
  }
}
