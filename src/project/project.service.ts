import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  create(createProjectDto: CreateProjectDto) {
    // const contractAddress = Buffer.from(
    //   createProjectDto.contractAddress.substring(2),
    //   'hex',
    // );
    // return this.prisma.project.create({
    //   data: {
    //     ...createProjectDto,
    //     contractAddress,
    //   },
    // });
    return this.prisma.project.create({ data: createProjectDto });
  }

  findAll() {
    return this.prisma.project.findMany({});
  }

  findOne(id: number) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  remove(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }
}
