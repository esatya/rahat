import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { CreateBeneficiaryDto } from './create-beneficiary.dto';

export class UpdateBeneficiaryDto extends PartialType(CreateBeneficiaryDto) {}

export class UpdateBeneficiaryStatusDto {
  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  isApproved: boolean;
}

export class AssignBeneficiaryToProjectDto {
  @ApiProperty({
    example: '2',
  })
  @IsString()
  projectId: string;
}
