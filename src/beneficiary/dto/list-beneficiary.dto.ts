import { ApiProperty } from '@nestjs/swagger';
import { BankStatus, InternetAccess, PhoneOwnership } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

interface BeneficiaryFilter {
  name?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
  bankStatus: BankStatus;
  phoneStatus: PhoneOwnership;
  internetStatus: InternetAccess;
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
  phoneStatus?: BeneficiaryFilter['phoneStatus'];

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
  internetStatus?: BeneficiaryFilter['internetStatus'];
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
