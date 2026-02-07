import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task } from '../entities/task.entity';
import { Organization } from '../entities/organization.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: any) {
    const task = this.taskRepository.create({
      ...createTaskDto,
      organizationId: user.organizationId,
      createdById: user.id,
    });

    const savedTask = await this.taskRepository.save(task);

    // Audit log
    await this.logAction(user.id, 'CREATE', 'Task', savedTask.id, `Created task: ${savedTask.title}`);

    return savedTask;
  }

  async findAll(user: any) {
    // Get accessible organization IDs based on user role
    const accessibleOrgIds = await this.getAccessibleOrganizations(user);

    // Fetch tasks from accessible organizations
    const tasks = await this.taskRepository.find({
      where: {
        organizationId: In(accessibleOrgIds),
      },
      relations: ['createdBy', 'assignedTo', 'organization'],
      order: {
        createdAt: 'DESC',
      },
    });

    return tasks;
  }

  async findOne(id: number, user: any) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['createdBy', 'assignedTo', 'organization'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Check if user has access to this task's organization
    const accessibleOrgIds = await this.getAccessibleOrganizations(user);
    if (!accessibleOrgIds.includes(task.organizationId)) {
      throw new ForbiddenException('Access denied to this task');
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, user: any) {
    const task = await this.findOne(id, user);

    // Only Owner and Admin can update
    if (!['Owner', 'Admin'].includes(user.role?.name)) {
      throw new ForbiddenException('Insufficient permissions to update tasks');
    }

    Object.assign(task, updateTaskDto);
    const updatedTask = await this.taskRepository.save(task);

    // Audit log
    await this.logAction(user.id, 'UPDATE', 'Task', updatedTask.id, `Updated task: ${updatedTask.title}`);

    return updatedTask;
  }

  async remove(id: number, user: any) {
    const task = await this.findOne(id, user);

    // Only Owner and Admin can delete
    if (!['Owner', 'Admin'].includes(user.role?.name)) {
      throw new ForbiddenException('Insufficient permissions to delete tasks');
    }

    await this.taskRepository.remove(task);

    // Audit log
    await this.logAction(user.id, 'DELETE', 'Task', id, `Deleted task: ${task.title}`);

    return { message: 'Task deleted successfully' };
  }

  private async getAccessibleOrganizations(user: any): Promise<number[]> {
    const userOrgId = user.organizationId;
    const accessibleOrgs = [userOrgId];

    // If user is Owner, they can access child organizations
    if (user.role?.name === 'Owner') {
      const childOrgs = await this.organizationRepository.find({
        where: { parentOrganizationId: userOrgId },
      });
      accessibleOrgs.push(...childOrgs.map((org) => org.id));
    }

    return accessibleOrgs;
  }

  private async logAction(
    userId: number,
    action: string,
    resource: string,
    resourceId: number,
    details: string,
  ) {
    const log = this.auditLogRepository.create({
      userId,
      action,
      resource,
      resourceId,
      details,
    });
    await this.auditLogRepository.save(log);
  }
}