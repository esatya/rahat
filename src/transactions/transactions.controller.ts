import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ListTransactionDto } from './dto/list-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@ApiTags('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll(@Query() query: ListTransactionDto) {
    return this.transactionsService.findAll(query);
  }

  @Get(':txHash')
  findOne(@Param('txHash') txHash: string) {
    return this.transactionsService.findOne(txHash);
  }

  @Patch(':txHash')
  update(
    @Param('txHash') txHash: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(txHash, updateTransactionDto);
  }

  @Delete(':txHash')
  remove(@Param('txHash') txHash: string) {
    return this.transactionsService.remove(txHash);
  }
}
