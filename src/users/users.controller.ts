import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto';

@Controller(`users`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(`signup`)
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Post(`login`)
  login(@Body() data: LoginUserDto) {
    return this.usersService.login(data);
  }

  @Get(`verify-token`)
  verifyToken(@Headers('authorization') token: string) {
    return this.usersService.verifyToken(token);
  }
}
