import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/modules/module-system/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const listUser = await this.prisma.users.findMany();

    const listUserReturn = listUser.map(
      ({
        password,
        facebook_id,
        instagram_id,
        github_id,
        google_id,
        ...user
      }) => user,
    );

    return listUserReturn;
  }
  async searchUser(username: string) {
    const listUserSearch = await this.prisma.users.findMany({
      where: {
        username: {
          contains: username,
        },
      },
    });

    const listUserSearchReturn = listUserSearch.map(
      ({
        password,
        facebook_id,
        instagram_id,
        github_id,
        google_id,
        ...user
      }) => user,
    );

    return listUserSearchReturn;
  }
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
