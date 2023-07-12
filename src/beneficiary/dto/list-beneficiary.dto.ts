import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

interface BeneficiaryFilter {
  name?: string;
  isActive?: boolean;
  isTokenAssigned?: boolean;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export class ListBeneficiaryDto {
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
  name?: BeneficiaryFilter['name'];

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'name',
  })
  orderBy: BeneficiaryFilter['orderBy'];

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'asc',
  })
  order: BeneficiaryFilter['order'];

  @ApiProperty({
    type: 'boolean',
    required: false,
  })
  @IsOptional()
  isActive?: BeneficiaryFilter['isActive'];

  @ApiProperty({
    type: 'boolean',
    required: false,
  })
  @IsOptional()
  isTokenAssigned?: BeneficiaryFilter['isTokenAssigned'];
}

export class ListBeneficiaryTransactionsDto {
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
}
