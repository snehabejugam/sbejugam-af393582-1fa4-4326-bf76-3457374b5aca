import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum TaskCategory {
  WORK = 'Work',
  PERSONAL = 'Personal'
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;

  @IsEnum(TaskCategory)
  @IsNotEmpty()
  category: TaskCategory;

  @IsNumber()
  @IsOptional()
  assignedToId?: number;
}