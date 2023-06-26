import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'number',
    required: true,
  })
  @IsString()
  @IsNumber()
  id: number;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    type: 'email',
    required: false,
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  phone?: string;
}
