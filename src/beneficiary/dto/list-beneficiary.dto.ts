import { ApiProperty } from '@nestjs/swagger';
import { BankStatus, InternetAccess, PhoneOwnership } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

interface BeneficiaryFilter {
  name?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
  bankStatus: BankStatus;
  phoneOwnership: PhoneOwnership;
  internetAccess: InternetAccess;
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
    type: PhoneOwnership,
    required: false,
  })
  @IsOptional()
  phoneOwnership?: BeneficiaryFilter['phoneOwnership'];

  @ApiProperty({
    type: BankStatus,
    required: false,
  })
  @IsOptional()
  bankStatus?: BeneficiaryFilter['bankStatus'];

  @ApiProperty({
    type: InternetAccess,
    required: false,
  })
  @IsOptional()
  internetAccess?: BeneficiaryFilter['internetAccess'];
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
