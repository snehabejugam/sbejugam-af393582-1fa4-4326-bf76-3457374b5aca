import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { TaskStatus, TaskCategory } from './create-task.dto';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskCategory)
  @IsOptional()
  category?: TaskCategory;

  @IsNumber()
  @IsOptional()
  assignedToId?: number;
}