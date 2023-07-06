import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

interface BeneficiaryFilter {
  name?: string;
  isActive?: boolean;
  isTokenAssigned?: boolean;
  orderBy?: string;
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
  })
  orderBy: BeneficiaryFilter['orderBy'];

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
