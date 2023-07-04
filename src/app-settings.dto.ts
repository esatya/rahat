import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class CreateAppSettingDto {
  @ApiProperty({
    example: 'CONTRACT_ADDRESS',
    description: 'Name of the app settings',
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    type: 'object',
    example: {
      RahatDonor: '0xDcd6F86EB1b62216F79943f4E6177F6892538120',
      RahatClaim: '0xCa8B87AF8CDa654eF873ae16665932abec836583',
      RahatToken: '0x422416b9203de06be4487D17DD1C76725c6049d7',
      RahatCommunity: '0x531e0540f4Ba3453C40EF1ef9D19dDa85e930aCc',
      CVAProject: '0x216EC842b77e424671219ABB817467fCEa991409',
    },
  })
  value: Prisma.JsonObject;
}

export class GetContractByNameDto {
  @ApiProperty({
    example: 'CONTRACT_ADDRESS',
    description: 'Name of the app settings',
    required: true,
  })
  @IsString()
  name: string;
}
