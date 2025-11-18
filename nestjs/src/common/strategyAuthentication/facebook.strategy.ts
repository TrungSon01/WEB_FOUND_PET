import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { app_constant } from '../constant/app.constant';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: app_constant.FACEBOOK_APP_ID!,
      clientSecret: app_constant.FACEBOOK_APP_SECRET!,
      callbackURL: app_constant.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, displayName } = profile;
    const user = {
      provider: 'facebook',
      providerId: profile.id,
      email: emails?.[0]?.value ?? null,
      firstName: name?.givenName ?? displayName,
      lastName: name?.familyName ?? '',
      picture: photos?.[0]?.value ?? null,
      accessToken,
    };
    done(null, user);
  }
}
