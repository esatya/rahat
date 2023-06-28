import { Test, TestingModule } from '@nestjs/testing';
import { Beneficiary } from '@prisma/client';
import { BeneficiaryController } from './beneficiary.controller';
import { BeneficiaryService } from './beneficiary.service';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { ListBeneficiaryDto } from './dto/list-beneficiary.dto';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';

describe('BeneficiaryController', () => {
  let controller: BeneficiaryController;
  let service: BeneficiaryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeneficiaryController],
      providers: [BeneficiaryService],
    }).compile();

    controller = module.get<BeneficiaryController>(BeneficiaryController);
    service = module.get<BeneficiaryService>(BeneficiaryService);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new beneficiary', async () => {
      const createDto: CreateBeneficiaryDto = {
        // Provide necessary data for create DTO
      };

      const expectedResult = {}; // Define the expected result

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(
        expect.any(CreateBeneficiaryDto),
      );
      expect(result).toEqual(expect.objectContaining(expectedResult));
    });
  });

  describe('findAll', () => {
    it('should return all beneficiaries', async () => {
      const query: ListBeneficiaryDto = {
        // Provide necessary data for query DTO
      };

      const expectedResult = {}; // Define the expected result

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(
        expect.any(ListBeneficiaryDto),
      );
      expect(result).toEqual(expect.objectContaining(expectedResult));
    });
  });

  describe('findOne', () => {
    it('should return a beneficiary by wallet address', async () => {
      const walletAddress = '...'; // Provide a wallet address

      const expectedResult = {}; // Define the expected result

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult);

      const result = await controller.findOne(walletAddress);

      expect(service.findOne).toHaveBeenCalledWith(walletAddress);
      expect(result).toEqual(expect.objectContaining(expectedResult));
    });
  });

  describe('update', () => {
    it('should update a beneficiary', async () => {
      const id = '...'; // Provide a beneficiary ID
      const updateDto: UpdateBeneficiaryDto = {
        // Provide necessary data for update DTO
      };

      const expectedResult: Beneficiary = {
        // Define the expected result
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      const result: Beneficiary = await controller.update(id, updateDto); // Add type annotation to result

      expect(service.update).toHaveBeenCalledWith(
        id,
        expect.any(UpdateBeneficiaryDto),
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a beneficiary', async () => {
      const id = '...'; // Provide a beneficiary ID

      const expectedResult = {}; // Define the expected result

      jest.spyOn(service, 'remove').mockResolvedValue(expectedResult);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(expect.objectContaining(expectedResult));
    });
  });
});
