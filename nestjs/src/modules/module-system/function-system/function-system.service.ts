import { Injectable } from '@nestjs/common';

@Injectable()
export class FunctionSystemService {
  returnUserWithoutSomeField(user: any) {
    if (!user) {
      return false;
    }
    const { updated_at, created_at, ...userReturn } = user;

    return userReturn;
  }
}
