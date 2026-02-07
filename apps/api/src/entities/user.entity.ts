import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './role.entity';
import { Organization } from './organization.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { unique: true })
  email!: string;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  password!: string;

  @Column('int', { name: 'role_id' })
  roleId!: number;

  @ManyToOne(() => Role, { eager: false })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @Column('int', { name: 'organization_id' })
  organizationId!: number;

  @ManyToOne(() => Organization, { eager: false })
  @JoinColumn({ name: 'organization_id' })
  organization!: Organization;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}