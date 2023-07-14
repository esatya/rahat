import { ApiProperty } from '@nestjs/swagger';
import {
  BankStatus,
  Gender,
  InternetAccess,
  PhoneOwnership,
} from '@prisma/client';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export class CreateBeneficiaryDto {
  @ApiProperty({
    example: 'Beneficiary Name',
    description: 'Beneficiary Name',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '0xac0C1207D054a64FFc68830b0db2e17Fc1e93766',
    description: 'Beneficiary Wallet Address',
  })
  @IsString()
  walletAddress: string;

  @ApiProperty({
    type: 'object',
  })
  @IsOptional()
  address?: Address;

  @ApiProperty({
    example: '1',
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({
    example: '1',
  })
  @IsOptional()
  @IsNumber()
  latitude: number;

  @ApiProperty({
    example: '1',
  })
  @IsOptional()
  @IsNumber()
  longitude: number;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isApproved: boolean;

  @ApiProperty({
    type: 'string',
    example: PhoneOwnership.FEATURE,
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneStatus: PhoneOwnership;

  @ApiProperty({
    type: 'string',

    required: false,
    example: BankStatus.UNDERBANKED,
  })
  @IsOptional()
  @IsString()
  bankStatus?: BankStatus;

  @ApiProperty({
    type: 'string',

    required: false,
    example: InternetAccess.HOME_INTERNET,
  })
  @IsString()
  @IsOptional()
  internetStatus?: InternetAccess;

  @ApiProperty({
    type: 'string',
    required: false,
    example: Gender.UNKNOWN,
  })
  @IsString()
  @IsOptional()
  gender?: Gender;
}
