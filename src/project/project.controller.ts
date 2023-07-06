import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { ListProjectDto } from './dto/list-project-dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';

@Controller('project')
@ApiTags('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  findAll(@Query() query: ListProjectDto) {
    return this.projectService.findAll(query);
  }

  @Get(':address')
  findOne(@Param('address') address: string) {
    return this.projectService.findOne(address);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Get(':address/beneficiaries')
  getBeneficiaries(@Param('address') address: string) {
    return this.projectService.getBeneficiaries(address);
  }
}
