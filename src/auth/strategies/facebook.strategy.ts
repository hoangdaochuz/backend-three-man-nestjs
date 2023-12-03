import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: `${process.env.FB_APP_ID}`,
      clientSecret: `${process.env.FB_APP_SECRET}`,
      callbackURL: 'http://localhost:8080/v1/api/auth/facebook/redirect',
      scope: ['email'],
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    console.log('🚀 ~ --> ~ refreshToken:', refreshToken);
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
