import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

interface UserFilter {
  name?: string;
  orderBy?: string;
}

export class ListUserDto {
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
  name?: UserFilter['name'];

  @ApiProperty({
    type: 'string',
    required: false,
  })
  orderBy: UserFilter['orderBy'];
}
