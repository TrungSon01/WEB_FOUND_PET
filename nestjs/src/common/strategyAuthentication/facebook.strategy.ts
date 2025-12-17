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
    const pictureUrl = `https://graph.facebook.com/${profile.id}/picture?type=large&redirect=false&access_token=${accessToken}`;

    const response = await fetch(pictureUrl);
    const data = await response.json();
    const realPhoto = data?.data?.url ?? profile.photos?.[0]?.value ?? null;

    const user = {
      provider: 'facebook',
      providerId: profile.id,
      email: profile.emails?.[0]?.value ?? null,
      firstName: profile.name?.givenName ?? profile.displayName,
      lastName: profile.name?.familyName ?? '',
      picture: realPhoto,
      accessToken,
    };

    done(null, user);
  }
}
