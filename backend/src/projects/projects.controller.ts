import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @GetUser() user: { userId: string },
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(user.userId, createProjectDto);
  }

  @Get()
  findAll(
    @GetUser() user: { userId: string },
    @Query() query: QueryProjectsDto,
  ): Promise<unknown> {
    return this.projectsService.findAll(user.userId, query);
  }

  @Get(':id')
  findOne(@GetUser() user: { userId: string }, @Param('id') id: string) {
    return this.projectsService.findOneByIdForOwner(id, user.userId);
  }

  @Patch(':id')
  update(
    @GetUser() user: { userId: string },
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, user.userId, updateProjectDto);
  }

  @Delete(':id')
  remove(@GetUser() user: { userId: string }, @Param('id') id: string) {
    return this.projectsService.remove(id, user.userId);
  }
}
