import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../tasks.schema';

export class QueryTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
