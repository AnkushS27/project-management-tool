import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './projects.schema';
import { Task, TaskDocument } from '../tasks/tasks.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';

interface ProjectListItem {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: string;
  owner: Types.ObjectId;
  createdAt: Date;
  taskCount: number;
}

interface PaginatedProjectsResponse {
  items: ProjectListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(ownerId: string, createProjectDto: CreateProjectDto) {
    return this.projectModel.create({
      ...createProjectDto,
      owner: new Types.ObjectId(ownerId),
    });
  }

  async findAll(
    ownerId: string,
    query: QueryProjectsDto,
  ): Promise<PaginatedProjectsResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<ProjectDocument> = {
      owner: new Types.ObjectId(ownerId),
    };

    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    if (query.status) {
      filter.status = query.status;
    }

    const [projects, total] = await Promise.all([
      this.projectModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.projectModel.countDocuments(filter).exec(),
    ]);

    const projectIds = projects.map((project) => project._id);
    const taskCountRows = await this.taskModel
      .aggregate<{ _id: Types.ObjectId; count: number }>([
        {
          $match: {
            project: { $in: projectIds },
          },
        },
        {
          $group: {
            _id: '$project',
            count: { $sum: 1 },
          },
        },
      ])
      .exec();

    const taskCountMap = new Map(
      taskCountRows.map((row) => [String(row._id), row.count]),
    );

    const items = projects.map((project) => ({
      ...project,
      taskCount: taskCountMap.get(String(project._id)) ?? 0,
    }));

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findOneByIdForOwner(projectId: string, ownerId: string) {
    const project = await this.projectModel.findById(projectId).exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (String(project.owner) !== ownerId) {
      throw new ForbiddenException('You cannot access this project');
    }

    return project;
  }

  async update(projectId: string, ownerId: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOneByIdForOwner(projectId, ownerId);

    Object.assign(project, updateProjectDto);
    await project.save();

    return project;
  }

  async remove(projectId: string, ownerId: string) {
    const project = await this.findOneByIdForOwner(projectId, ownerId);
    await this.projectModel.deleteOne({ _id: project._id }).exec();

    return { message: 'Project deleted successfully' };
  }
}
