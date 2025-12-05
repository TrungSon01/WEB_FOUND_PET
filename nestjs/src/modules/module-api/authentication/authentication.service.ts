import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateAuthenticationDto,
  Login_DTO,
} from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { PrismaService } from 'src/modules/module-system/prisma/prisma.service';
import { TokenService } from 'src/modules/module-system/token/token.service';
import { Prisma } from '@prisma/client';
import { FunctionSystemService } from 'src/modules/module-system/function-system/function-system.service';
import axios from 'axios';
import { app_constant } from 'src/common/constant/app.constant';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokenService,
    private readonly functionSystem: FunctionSystemService,
  ) {}

  async googleLogin(req: any) {
    const { id, displayName, emails, photos } = req.user.profile;

    let userExist = await this.prisma.users.findFirst({
      where: {
        OR: [{ email: emails?.[0]?.value }, { google_id: id }],
      },
    });

    let userReturn;

    if (!userExist) {
      // Step 1: Tạo user trong DB
      userExist = await this.prisma.users.create({
        data: {
          google_id: id,
          username: displayName,
          email: emails?.[0]?.value,
          avatar: photos?.[0]?.value,
        },
      });

      // Step 2: Sync với Django
      const userToDjango =
        this.functionSystem.returnUserWithoutSomeField(userExist);
      console.log('userToDjango', userToDjango);
      try {
        await axios.post(app_constant.URL_LOGIN_DJANGO, {
          user_id: userToDjango.user_id,
          username: userToDjango.username,
          email: userToDjango.email,
          avatar: userToDjango.avatar,
          google_id: id,
        });
      } catch (error) {
        await this.prisma.users.delete({
          where: { user_id: userToDjango.user_id },
        });
        throw new Error('Failed to sync user with Django');
      }
    }

    userReturn = this.functionSystem.returnUserWithoutSomeField(userExist);
    const tokens = this.tokens.createTokens(userReturn);
    return tokens;
  }

  async facebookLogin(req: any) {
    const { providerId, email, firstName, lastName, picture } = req.user;
    const username = `${firstName} ${lastName}`;

    // Chuẩn hóa email
    const normalizedEmail =
      email && email !== 'null' && email.trim() !== '' ? email : null;

    // 1. Tìm user theo facebook_id trước
    let userExist = await this.prisma.users.findFirst({
      where: { facebook_id: providerId },
    });

    // 2. Nếu chưa có, tìm theo email để merge account
    if (!userExist && normalizedEmail) {
      const userByEmail = await this.prisma.users.findUnique({
        where: { email: normalizedEmail },
      });

      if (userByEmail) {
        // Merge account với transaction + rollback
        try {
          userExist = await this.prisma.$transaction(async (tx) => {
            const updatedUser = await tx.users.update({
              where: { email: normalizedEmail },
              data: { facebook_id: providerId },
            });

            // Sync sang Django
            await axios.patch(
              `${app_constant.URL_LOGIN_DJANGO}${updatedUser.user_id}/`,
              { facebook_id: providerId },
            );

            return updatedUser;
          });
        } catch (error) {
          throw new Error(`Failed to merge account: ${error.message}`);
        }
      }
    }

    // 3. Nếu vẫn chưa có user → tạo mới
    if (!userExist) {
      try {
        userExist = await this.prisma.$transaction(async (tx) => {
          const newUser = await tx.users.create({
            data: {
              username: username || 'Facebook User',
              email: normalizedEmail,
              avatar: picture || '',
              facebook_id: providerId,
              role: 'user',
            },
          });

          // Sync sang Django
          await axios.post(app_constant.URL_LOGIN_DJANGO, {
            user_id: newUser.user_id,
            username: newUser.username,
            email: newUser.email,
            avatar: newUser.avatar,
            facebook_id: providerId,
          });

          return newUser;
        });
      } catch (error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }
    }

    const userReturn =
      this.functionSystem.returnUserWithoutSomeField(userExist);
    const tokens = this.tokens.createTokens(userReturn);
    return tokens;
  }

  async githubLogin(req: any) {
    const { githubId, email, username, avatar } = req.user;

    console.log('GitHub user:', req.user);

    let userExist;

    // 1. Nếu có githubId → tìm theo githubId trước
    if (githubId) {
      userExist = await this.prisma.users.findUnique({
        where: { github_id: githubId },
      });
    }

    // 2. Nếu chưa tồn tại và có email → kiểm tra email để merge account
    if (!userExist && email) {
      const userByEmail = await this.prisma.users.findUnique({
        where: { email },
      });

      if (userByEmail) {
        try {
          // Merge account: update github_id cho user trùng email
          userExist = await this.prisma.users.update({
            where: { email },
            data: { github_id: githubId },
          });

          // Sync Django (PATCH)
          await axios.patch(
            `${app_constant.URL_LOGIN_DJANGO}${userExist.user_id}/`,
            { github_id: githubId },
          );
        } catch (error) {
          console.error('Lỗi cập nhật github_id:', error);
          throw new Error('Failed to update GitHub ID');
        }
      }
    }

    // 3. Nếu vẫn chưa có user → tạo mới
    if (!userExist) {
      try {
        userExist = await this.prisma.users.create({
          data: {
            github_id: githubId,
            email: email || '',
            username: username || 'GitHub User',
            avatar: avatar || '',
            role: 'user',
          },
        });

        // Sync Django (POST)
        try {
          await axios.post(app_constant.URL_LOGIN_DJANGO, {
            user_id: userExist.user_id,
            username: userExist.username,
            email: userExist.email,
            avatar: userExist.avatar,
            github_id: githubId,
          });
        } catch (err) {
          console.error('Sync Django error:', err);
          // Nếu sync fail → rollback ở Prisma
          await this.prisma.users.delete({
            where: { user_id: userExist.user_id },
          });
          throw new Error('Failed to sync user with Django');
        }
      } catch (error) {
        console.error(error);
        throw new BadRequestException('Cannot create GitHub user');
      }
    }

    // 4. Nếu user tồn tại nhưng chưa có email → update email (GitHub đôi khi không trả email)
    if (
      userExist &&
      email &&
      (!userExist.email || userExist.email === 'null')
    ) {
      try {
        await this.prisma.users.update({
          where: { user_id: userExist.user_id },
          data: { email },
        });
      } catch (error) {
        console.log('Không thể update email:', error);
      }
    }

    // 5. Trả về token
    const userReturn =
      this.functionSystem.returnUserWithoutSomeField(userExist);
    const tokens = this.tokens.createTokens(userReturn);

    return tokens;
  }

  async register(user: CreateAuthenticationDto) {
    const checkUserExist = await this.prisma.users.findFirst({
      where: { email: user.email },
    });

    const isNew = !checkUserExist;

    const finalUser = isNew
      ? await this.prisma.users.create({ data: user })
      : checkUserExist;

    const userReturn =
      this.functionSystem.returnUserWithoutSomeField(finalUser);

    console.log('userReturn', userReturn);

    // Sync sang backend Django (chỉ khi tạo user mới)
    if (isNew) {
      try {
        await axios.post(app_constant.URL_LOGIN_DJANGO, {
          user_id: userReturn.user_id,
          username: userReturn.username,
          phone: userReturn.phone,
          password: userReturn.password,
          email: userReturn.email,
          role: 'user',
        });
        console.log('<==Sync Backend Django thành công==>');
      } catch (error) {
        console.error('Sync Backend Django thất bại: ==>', error.message);
        // Có thể thêm logic retry hoặc log vào queue để sync sau
      }
    }
    delete userReturn.password;
    return {
      success: isNew,
      message: isNew ? 'Tạo tài khoản thành công' : 'Email đã được sử dụng',
      user: userReturn,
    };
  }

  async login(login: Login_DTO) {
    if (!login) {
      return {
        user: null,
        message: 'Dữ liệu đăng nhập không hợp lệ',
        success: false,
      };
    }
    const { email, password } = login;
    const checkUserExist = await this.prisma.users.findFirst({
      where: {
        email: email,
        password: password,
      },
    });
    console.log('checkUsser exisst', checkUserExist);
    if (!checkUserExist) {
      return { user: null, message: 'user not in database', success: false };
    } else {
      const userReturn =
        await this.functionSystem.returnUserWithoutSomeField(checkUserExist);

      return { user: userReturn, message: 'user in database', success: true };
    }
  }
  findAll() {
    return `This action returns all authentication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authentication`;
  }

  update(id: number, updateAuthenticationDto: UpdateAuthenticationDto) {
    return `This action updates a #${id} authentication`;
  }

  remove(id: number) {
    return `This action removes a #${id} authentication`;
  }
}
