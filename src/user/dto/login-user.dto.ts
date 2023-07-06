import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestUserOtpDto {
  @ApiProperty({
    type: 'email',
    required: false,
    example: 'user1@rahat.com',
  })
  @IsEmail()
  email: string;
}

export class VerifyUserOtpDto {
  @ApiProperty({
    type: 'email',
    required: true,
    example: 'user1@rahat.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    example: '1234',
  })
  @IsEmail()
  @IsNotEmpty()
  otp: string;
}
