import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

interface ProjectFilter {
  name?: string;
  orderBy?: string;
}

export class ListProjectDto {
  @ApiProperty({
    description: 'Page to load',
    example: '1',
    required: false,
  })
  @IsString()
  @IsOptional()
  page?: string;

  @ApiProperty({
    example: '10',
    required: false,
  })
  @IsString()
  @IsOptional()
  perPage?: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  name?: ProjectFilter['name'];

  @ApiProperty({
    type: 'string',
    required: false,
  })
  orderBy: ProjectFilter['orderBy'];
}
