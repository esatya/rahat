import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'email',
    required: false,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  phone: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  walletAddress: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  profileImage?: string;
}
