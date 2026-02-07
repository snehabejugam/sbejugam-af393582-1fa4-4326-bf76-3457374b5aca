import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  title!: string;

  @Column('text')
  description!: string;

  @Column('varchar')
  status!: string;

  @Column('varchar')
  category!: string;

  @Column('int', { name: 'organization_id' })
  organizationId!: number;

  @ManyToOne(() => Organization)
  organization!: Organization;

  @Column('int', { name: 'created_by_id' })
  createdById!: number;

  @ManyToOne(() => User)
  createdBy!: User;

  @Column('int', { name: 'assigned_to_id', nullable: true })
  assignedToId!: number | null;

  @ManyToOne(() => User, { nullable: true })
  assignedTo!: User | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}