import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListTransactionDto {
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
  orderBy?: string;
}
