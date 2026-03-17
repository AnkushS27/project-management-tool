import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Task, TaskDocument } from './tasks.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(ownerId: string, createTaskDto: CreateTaskDto) {
    await this.projectsService.findOneByIdForOwner(createTaskDto.project, ownerId);

    return this.taskModel.create({
      ...createTaskDto,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
      project: new Types.ObjectId(createTaskDto.project),
    });
  }

  async findByProject(ownerId: string, projectId: string, query: QueryTasksDto) {
    await this.projectsService.findOneByIdForOwner(projectId, ownerId);

    const filter: FilterQuery<TaskDocument> = {
      project: new Types.ObjectId(projectId),
    };

    if (query.status) {
      filter.status = query.status;
    }

    return this.taskModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async update(ownerId: string, taskId: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskModel.findById(taskId).exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const project = await this.projectsService.findOneByIdForOwner(
      String(task.project),
      ownerId,
    );

    if (!project) {
      throw new ForbiddenException('You cannot update this task');
    }

    Object.assign(task, {
      ...updateTaskDto,
      dueDate: updateTaskDto.dueDate
        ? new Date(updateTaskDto.dueDate)
        : task.dueDate,
    });

    await task.save();
    return task;
  }

  async remove(ownerId: string, taskId: string) {
    const task = await this.taskModel.findById(taskId).exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.projectsService.findOneByIdForOwner(String(task.project), ownerId);
    await this.taskModel.deleteOne({ _id: task._id }).exec();

    return { message: 'Task deleted successfully' };
  }
}
