import { Injectable } from '@nestjs/common';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { PrismaService } from 'src/modules/module-system/prisma/prisma.service';
import { TokenService } from 'src/modules/module-system/token/token.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokenService,
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
      role,
      updated_at,
      password,
      ...userReturn
    } = userExist;
    console.log(userReturn);
    return userExist;

    // const tokens = this.tokens.createTokens(userExist.user_id);
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
  create(createAuthenticationDto: CreateAuthenticationDto) {
    return 'This action adds a new authentication';
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
