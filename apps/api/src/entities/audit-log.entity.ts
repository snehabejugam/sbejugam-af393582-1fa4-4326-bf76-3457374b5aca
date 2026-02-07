import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { name: 'user_id' })
  userId!: number;

  @ManyToOne(() => User)
  user!: User;

  @Column('varchar')
  action!: string;

  @Column('varchar')
  resource!: string;

  @Column('int', { name: 'resource_id', nullable: true })
  resourceId!: number | null;

  @Column('text')
  details!: string;

  @CreateDateColumn()
  timestamp!: Date;
}