import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')  // ← Add explicit type
  name!: string;

  @Column('int', { name: 'parent_organization_id', nullable: true })  // ← Add explicit type
  parentOrganizationId!: number | null;

  @ManyToOne(() => Organization, { nullable: true })
  parentOrganization!: Organization | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}