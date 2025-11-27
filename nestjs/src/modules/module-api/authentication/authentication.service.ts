import { Injectable } from '@nestjs/common';
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

    if (!userExist) {
      userExist = await this.prisma.users.create({
        data: {
          google_id: id,
          username: displayName,
          email: emails?.[0]?.value,
          avatar: photos?.[0]?.value,
        },
      });
    }
    const {
      facebook_id,
      google_id,
      github_id,
      created_at,
      instagram_id,
      phone,
      updated_at,
      ...userReturn
    } = userExist;
    console.log(userReturn);

    const tokens = this.tokens.createTokens(userReturn);
    return tokens;
    // console.log(tokens);
  }

  async facebookLogin(req: any) {
    console.log(req.user);
    const userExist = await this.prisma.users.findFirst({
      where: {
        facebook_id: req.user.providerId,
      },
    });
    if (userExist?.email === 'null' || userExist?.email === null) {
      await this.prisma.users.update({
        where: {
          facebook_id: req.user.providerId,
        },
        data: {
          email: req.user.email,
        },
      });
    }

    if (!userExist) {
      await this.prisma.users.create({
        data: {
          email: `${req.user.email}`,
          facebook_id: req.user.providerId,
          username: req.user.firstName,
          avatar: req.user.avatar,
        },
      });
    }
    const tokens = this.tokens.createTokens(userExist?.user_id || 1);

    console.log(tokens);
    return tokens;
  }

  async githubLogin(req: any) {
    const { github_id, email, username, avatar } = req.user;

    let userExist = await this.prisma.users.findUnique({
      where: { github_id },
    });

    if (!userExist && email) {
      const userByEmail = await this.prisma.users.findUnique({
        where: { email },
      });
      if (userByEmail) {
        userExist = await this.prisma.users.update({
          where: { email },
          data: { github_id },
        });
      }
    }

    if (!userExist) {
      userExist = await this.prisma.users.create({
        data: {
          github_id,
          email: email || null,
          username: username || 'Người dùng GitHub',
          avatar: avatar || null,
        },
      });
    }

    if (userExist && (!userExist.email || userExist.email === 'null')) {
      await this.prisma.users.update({
        where: { github_id },
        data: { email },
      });
    }
    const tokens = this.tokens.createTokens(userExist.user_id);
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
        await axios.post('http://localhost:8000/api/users/', {
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
    console.log(login);
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
