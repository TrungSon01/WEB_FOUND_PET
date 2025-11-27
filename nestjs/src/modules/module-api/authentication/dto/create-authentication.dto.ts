import { IsNotEmpty, IsString } from 'class-validator';

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
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
