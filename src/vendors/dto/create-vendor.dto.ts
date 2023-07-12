import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

type Address = {
  location: string;
  postal: number;
  country: string;
};

export class CreateVendorDto {
  @ApiProperty({
    example: 'Rahat Distributor',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '0x0000012',
  })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({
    example: {
      location: 'ktm',
      postal: 224214,
      country: 'nepal',
    },
  })
  @IsObject()
  address: Address;
}
