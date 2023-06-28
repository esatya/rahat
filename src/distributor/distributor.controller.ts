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
import { DistributorService } from './distributor.service';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { ListDistributorDto } from './dto/list-distributor.dto';
import { UpdateDistributorDto } from './dto/update-distributor.dto';

@Controller('distributor')
@ApiTags('distributor')
export class DistributorController {
  constructor(private readonly distributorService: DistributorService) {}

  @Post()
  create(@Body() createDistributorDto: CreateDistributorDto) {
    return this.distributorService.create(createDistributorDto);
  }

  @Get()
  findAll(@Query() query: ListDistributorDto) {
    return this.distributorService.findAll(query);
  }

  @Get(':walletAddress')
  findOne(@Param('walletAddress') walletAddress: string) {
    return this.distributorService.findOne(walletAddress);
  }

  @Patch(':walletAddress')
  update(
    @Param('walletAddress') walletAddress: string,
    @Body() updateDistributorDto: UpdateDistributorDto,
  ) {
    return this.distributorService.update(walletAddress, updateDistributorDto);
  }

  @Delete(':walletAddress')
  remove(@Param('walletAddress') walletAddress: string) {
    return this.distributorService.remove(walletAddress);
  }

  @Patch(':walletAddress/approval')
  approval(@Param('walletAddress') walletAddress: string) {
    return this.distributorService.approval(walletAddress);
  }

  @Post('register')
  register(@Body() createDistributorDto: CreateDistributorDto) {
    return this.distributorService.register(createDistributorDto);
  }
}
