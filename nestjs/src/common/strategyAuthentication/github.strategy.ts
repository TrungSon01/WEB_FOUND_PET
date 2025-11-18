import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { app_constant } from '../constant/app.constant';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: app_constant.GITHUB_CLIENT_ID!,
      clientSecret: app_constant.GITHUB_CLIENT_SECRET!,
      callbackURL: app_constant.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const email =
      profile.emails && profile.emails.length > 0
        ? profile.emails[0].value
        : null;

    const avatar =
      profile.photos && profile.photos.length > 0
        ? profile.photos[0].value
        : null;

    const user = {
      githubId: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      email,
      avatar,
      accessToken,
    };

    done(null, user);
  }
}
