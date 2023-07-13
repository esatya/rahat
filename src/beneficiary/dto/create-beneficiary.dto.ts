import { ApiProperty } from '@nestjs/swagger';
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
  @IsOptional()
  walletAddress?: string;

  @ApiProperty({
    type: 'object',
  })
  address: Address;

  @ApiProperty({
    example: '1',
  })
  @IsOptional()
  @IsString()
  projectId: string;

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
}
