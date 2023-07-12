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
import {
  ListBeneficiaryDto,
  ListBeneficiaryTransactionsDto,
} from './dto/list-beneficiary.dto';
import {
  AssignBeneficiaryToProjectDto,
  UpdateBeneficiaryDto,
  UpdateBeneficiaryStatusDto,
} from './dto/update-beneficiary.dto';

@Controller('beneficiaries')
@ApiTags('beneficiaries')
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

  @Get('geo')
  getGeoLocation() {
    console.log('here');
    return this.beneficiaryService.getGeoLocation();
  }

  @Get('stats')
  getStats() {
    return this.beneficiaryService.getStats();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.beneficiaryService.findOne(uuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() updateBeneficiaryDto: UpdateBeneficiaryDto,
  ) {
    return this.beneficiaryService.update(uuid, updateBeneficiaryDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.beneficiaryService.remove(uuid);
  }

  @Get(':uuid/transactions')
  getTransactions(
    @Param('uuid') uuid: string,
    @Query() query: ListBeneficiaryTransactionsDto,
  ) {
    return this.beneficiaryService.getTransactions(uuid, query);
  }

  @Post(':uuid/projects')
  assignProject(
    @Param('uuid') uuid: string,
    @Body() updateProjectData: AssignBeneficiaryToProjectDto,
  ) {
    return this.beneficiaryService.assignProject(
      uuid,
      +updateProjectData.projectId,
    );
  }

  @Patch(':uuid/status')
  updateStatus(
    @Param('uuid') uuid: string,
    @Body() update: UpdateBeneficiaryStatusDto,
  ) {
    return this.beneficiaryService.updateStatus(uuid, update);
  }
}
