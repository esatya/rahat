import { PartialType } from '@nestjs/swagger';
import { CreateDistributorDto } from './create-distributor.dto';

export class UpdateDistributorDto extends PartialType(CreateDistributorDto) {}
