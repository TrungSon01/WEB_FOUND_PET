import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { app_constant } from 'src/common/constant/app.constant';
@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createTokens(user_id: number) {
    const accessToken = this.jwtService.sign(
      { user_id },
      {
        secret: app_constant.ACCESS_TOKEN_SECRET,
        expiresIn: app_constant.ACCESS_TOKEN_SECRET_EXPIRES_IN as any,
      },
    );
    const refreshToken = this.jwtService.sign(
      { user_id },
      {
        secret: app_constant.REFRESH_TOKEN_SECRET,
        expiresIn: app_constant.REFRESH_TOKEN_SECRET_EXPIRES_IN as any,
      },
    );

    return { accessToken, refreshToken };
  }
  verifyToken = (accessToken: string) => {
    return this.jwtService.verify(accessToken, {
      secret: app_constant.ACCESS_TOKEN_SECRET,
    });
  };
  verifyRefreshToken = (refreshToken: string) => {
    return this.jwtService.verify(refreshToken, {
      secret: app_constant.REFRESH_TOKEN_SECRET,
    });
  };
}
