import { Controller, Get, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(): Promise<any[]> {
    return this.projectsService.findAll();
  }

  @Get('find')
  findOne(@Query('id') id: number): Promise<any> {
    return this.projectsService.findOne(id);
  }

  @Get('create')
  async create(
    @Query('name') name: string,
      @Query('directory') directory: string,
      @Query('command') command: string,
  ): Promise<any> {
    return this.projectsService.create({
      name,
      directory,
      command,
    });
  }
}
