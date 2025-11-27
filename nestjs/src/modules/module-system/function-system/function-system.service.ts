import { Injectable } from '@nestjs/common';

@Injectable()
export class FunctionSystemService {
  returnUserWithoutSomeField(user: any) {
    if (!user) {
      return false;
    }
    const {
      facebook_id,
      github_id,
      google_id,
      updated_at,
      created_at,
      instagram_id,
      ...userReturn
    } = user;

    return userReturn;
  }
}
