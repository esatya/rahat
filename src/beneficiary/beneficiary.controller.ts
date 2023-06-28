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
import { BeneficiaryService } from './beneficiary.service';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { ListBeneficiaryDto } from './dto/list-beneficiary.dto';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';

@Controller('beneficiary')
@ApiTags('beneficiary')
export class BeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}

  @Post()
  create(@Body() createBeneficiaryDto: CreateBeneficiaryDto) {
    return this.beneficiaryService.create(createBeneficiaryDto);
  }

  @Get()
  findAll(@Query() query: ListBeneficiaryDto) {
    return this.beneficiaryService.findAll(query);
  }

  @Get(':walletAddress')
  findOne(@Param('walletAddress') walletAddress: string) {
    return this.beneficiaryService.findOne(walletAddress);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBeneficiaryDto: UpdateBeneficiaryDto,
  ) {
    return this.beneficiaryService.update(+id, updateBeneficiaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.beneficiaryService.remove(+id);
  }
}
