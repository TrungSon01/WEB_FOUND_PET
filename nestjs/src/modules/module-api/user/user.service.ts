import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/modules/module-system/prisma/prisma.service';
import cloudinary from 'src/modules/module-system/cloudinary/init.cloudinary';
import axios from 'axios';
import { FunctionSystemService } from 'src/modules/module-system/function-system/function-system.service';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly functionSystem: FunctionSystemService,
  ) {}
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

  async uploadCloudAvatarUser(file: Express.Multer.File, user_id: number) {
    console.log('file vào nestJS', file);

    const byteArrayBuffer = file.buffer;
    const userExist = await this.prisma.users.findUnique({
      where: {
        user_id: user_id,
      },
    });

    if (!userExist) throw new BadRequestException('user is not exist');
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'Web_Found_Pet_Avatar_User' },
          (error, result) => {
            if (error) return reject(error);
            return resolve(result);
          },
        )
        .end(byteArrayBuffer);
    });
    console.log(uploadResult);
    const transaction = await this.prisma.$transaction(async (prisma) => {
      try {
        const updatedUser = await prisma.users.update({
          where: { user_id },
          data: { avatar: uploadResult.public_id },
        });

        await axios.patch(
          `http://localhost:8000/api/users/${user_id}/`,
          { avatar: uploadResult.public_id },
          { headers: { 'Content-Type': 'application/json' } },
        );

        return updatedUser;
      } catch (err) {
        console.error('Error syncing avatar:', err);
        throw err;
      }
    });
    const transactionReturn =
      this.functionSystem.returnUserWithoutSomeField(transaction);
    return transactionReturn;
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
