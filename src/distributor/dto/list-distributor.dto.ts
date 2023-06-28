import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

interface DistributorFilter {
  name?: string;
  orderBy?: string;
}

export class ListDistributorDto {
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
  name?: DistributorFilter['name'];

  @ApiProperty({
    type: 'string',
    required: false,
  })
  orderBy: DistributorFilter['orderBy'];
}
