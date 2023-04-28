import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class ProjectsService extends PrismaClient {
  create(createProjectDto: CreateProjectDto) {
    return this.project.create({ data: createProjectDto });
  }

  findAll() {
    return this.project.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.project.update({
      where: { id: id },
      data: updateProjectDto,
    });
  }

  remove(id: number) {
    return this.project.delete({ where: { id: id } });
  }
}
