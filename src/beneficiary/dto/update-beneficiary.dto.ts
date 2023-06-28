import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateBeneficiaryDto } from './create-beneficiary.dto';

export class UpdateBeneficiaryDto extends PartialType(CreateBeneficiaryDto) {}

export class UpdateBeneficiaryBalanceDto {
  @ApiProperty({
    example: '2',
  })
  @IsOptional()
  @IsString()
  tokenAssigned?: string;

  @ApiProperty({
    example: '2',
  })
  @IsOptional()
  @IsString()
  tokensClaimed?: string;
}
