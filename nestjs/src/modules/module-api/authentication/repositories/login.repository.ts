// import { PrismaService } from 'src/modules/module-system/prisma/prisma.service';
// import { User } from '../domain/user.entity';

// export class UserRepository {
//   constructor(private prisma: PrismaService) {}

//   async findByEmail(email: string): Promise<User | null> {
//     const data = await this.prisma.users.findFirst({ where: { email } });
//     return data ? new User(data.id, data.email, data.password) : null;
//   }

//   async save(user: User): Promise<User> {
//     const data = await this.prisma.users.create({
//       data: { email: user.email, password: user['password'] },
//     });
//     return new User(data.id, data.email, data.password);
//   }
// }
