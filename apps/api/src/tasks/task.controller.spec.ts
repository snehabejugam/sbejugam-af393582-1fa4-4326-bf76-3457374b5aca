// apps/api/src/tasks/tasks.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ForbiddenException } from '@nestjs/common';
import { TaskStatus, TaskCategory } from './dto/create-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockOwnerUser = {
    id: 1,
    email: 'owner@example.com',
    roleId: 1,
    organizationId: 1,
    role: { name: 'Owner' },
  };

  const mockViewerUser = {
    id: 3,
    email: 'viewer@example.com',
    roleId: 3,
    organizationId: 2,
    role: { name: 'Viewer' },
  };

  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'TODO',
    category: 'Work',
    organizationId: 1,
    createdById: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task for Owner role', async () => {
      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(
        { title: 'Test', description: 'Test', status: TaskStatus.TODO, category: TaskCategory.WORK },
        mockOwnerUser
      );

      expect(result).toEqual(mockTask);
      expect(mockTasksService.create).toHaveBeenCalledWith(
        expect.any(Object),
        mockOwnerUser
      );
    });
  });

  describe('findAll', () => {
    it('should return all accessible tasks for user', async () => {
      const tasks = [mockTask];
      mockTasksService.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll(mockOwnerUser);

      expect(result).toEqual(tasks);
      expect(mockTasksService.findAll).toHaveBeenCalledWith(mockOwnerUser);
    });
  });

  describe('update', () => {
    it('should update task for Owner', async () => {
      const updatedTask = { ...mockTask, title: 'Updated' };
      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(
        '1',
        { title: 'Updated' },
        mockOwnerUser
      );

      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should delete task for Owner', async () => {
      mockTasksService.remove.mockResolvedValue({ message: 'Task deleted successfully' });

      const result = await controller.remove('1', mockOwnerUser);

      expect(result.message).toBe('Task deleted successfully');
    });
  });
});