import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // detail user
  @Get()
  searchUser(@Query('username') username: string) {
    return this.userService.searchUser(username);
  }

  // all user
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post('upload-cloud-avatar-user')
  // vì Cloudinary không nhận file dạng “form-data thô” nên phải dùng cái này
  @UseInterceptors(FileInterceptor('web_found_pet'))
  uploadCloudAvatarUser(@UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadCloudAvatarUser(file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
