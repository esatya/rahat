import { ApiProperty } from '@nestjs/swagger';
import { Prisma, TxStatus } from '@prisma/client';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @ApiProperty({
    example: 'PENDING',
    description: 'The status of the transaction',
  })
  @IsNotEmpty()
  public txStatus: TxStatus;

  @ApiProperty({
    example: 'Rahat',
    description: 'Contract name',
  })
  @IsString()
  public contractName: string;

  @ApiProperty({
    example: '0x1234567890',
    description: 'Contract Address',
  })
  @IsString()
  public contractAddress: string;

  @ApiProperty({
    example: 1234567890,
    description: 'The timestamp of the transaction',
  })
  @IsNotEmpty()
  public timestamp: number;

  @ApiProperty({
    example: 'method',
    description: 'The method of the transaction',
    required: true,
  })
  @IsString()
  public method: string;

  @ApiProperty({
    example: 'methodParams',
    description: 'The method params of the transaction',
  })
  @IsArray()
  public methodParams: Prisma.JsonValue[];

  @ApiProperty({
    example: 1234567890,
    description: 'The block number of the transaction',
  })
  @IsNotEmpty()
  public blockNumber: number;

  @ApiProperty({
    example: '0xaed90',
    description: 'The from of the transaction',
  })
  @IsNotEmpty()
  public from: string;

  @ApiProperty({
    example: '0xaed90',
    description: 'The to of the transaction',
  })
  @IsNotEmpty()
  public to: string;

  @ApiProperty({
    example: '12',
    description: 'The value of the transaction',
  })
  @IsNotEmpty()
  public value: string;

  @ApiProperty({
    example: 'remarks',
    description: 'The remarks of the transaction',
  })
  @IsOptional()
  public remarks: string;

  @ApiProperty({
    example: 'events',
    description: 'The hash of the transaction',
  })
  @IsArray()
  public events: Prisma.JsonValue[];
}
