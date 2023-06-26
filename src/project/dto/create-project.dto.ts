import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    type: 'number',
    required: true,
  })
  id: number;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  name: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  startDate: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  endDate: string;

  @ApiProperty({
    type: 'number',
    required: false,
  })
  owner: number;

  @ApiProperty({
    type: 'number',
    required: false,
  })
  budget: number;

  @ApiProperty({
    type: 'number',
    required: false,
  })
  disbursed: number;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  extras: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  location: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  projectType: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  projectManager: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  description: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  contractAddress: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  deletedAt: string;

  @ApiProperty({
    type: 'boolean',
    required: false,
    default: false,
  })
  isApproved?: boolean = false;
}
