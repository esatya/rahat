import { ForbiddenError } from '@casl/ability';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbilityFactory, Action } from '../ability/ability.factory';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUserDto } from './dto/list-user.dto';
import { RequestUserOtpDto, VerifyUserOtpDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private abilityFactory: AbilityFactory,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const user = { id: 1, isAdmin: false, orgId: 1 }; //req.user (mocked Data)
    const ability = this.abilityFactory.defineAbilitiesFor(user);

    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.CREATE, User);
      return this.userService.create(createUserDto);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }
  }

  @Get()
  // @CheckAbilities(new ReadUserAbility())
  findAll(@Query() query: ListUserDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  // @CheckAbilities(new ReadUserAbility())
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  // @CheckAbilities({ action: Action.UPDATE, subject: User })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // Pull user data from DB before executing the CASL check
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  // @CheckAbilities({ action: Action.DELETE, subject: User })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('login/otp')
  requestOtp(@Body() requestOtpDto: RequestUserOtpDto) {
    return this.userService.requestOtp(requestOtpDto);
  }

  @Post('login/verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyUserOtpDto) {
    return this.userService.verifyOtp(verifyOtpDto);
  }
}
