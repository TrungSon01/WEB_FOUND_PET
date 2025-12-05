import { IsNotEmpty, IsString } from 'class-validator';
import { PrismaService } from 'src/modules/module-system/prisma/prisma.service';

export class CreateAuthenticationDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  password?: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  avatar?: string;

  @IsString()
  phone: string;
}

export class Login_DTO {
  constructor(private readonly prisma: PrismaService) {}
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
