import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { wrapperResponse } from 'src/utils';
import { UpdateUserInfoDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('info')
  getUserInfo(@Req() req: any) {
    return this.userService.findByUserID(req.user.id);
  }
  @Get(':id')
  getUser(@Query('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Get()
  getUsers() {
    return this.userService.findAll();
  }
  @Post()
  createUser(@Body() Body) {
    return this.userService.createUser(Body);
  }
  @Put()
  updateUser(
    @Req() req: Request,
    @Query('id', ParseIntPipe) id: number,
    @Body() Body: UpdateUserInfoDto,
  ) {
    return this.userService.update(id, Body);
  }
  @Delete(':id')
  removeUser(@Query('id', ParseIntPipe) id: number) {
    return this.userService.removeUser(id);
  }
}
