import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import {
  CreateAuthenticationDto,
  Login_DTO,
} from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport sẽ tự redirect sang Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req: any, @Res() res: Response) {
    const tokens = await this.authenticationService.googleLogin(req);
    return res.redirect(
      `http://localhost:5173/login-success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    );
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {
    // Passport sẽ tự redirect sang Facebook
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Request() req: any, @Res() res: Response) {
    const tokens = await this.authenticationService.facebookLogin(req);
    return res.redirect(
      `http://localhost:5173/login-success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    );
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // Passport sẽ tự redirect sang Github
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Request() req: any, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authenticationService.githubLogin(req);
    return res.redirect(
      `http://localhost:5173/login-success?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }
  @Post('register')
  register(@Body() createAuthenticationDto: CreateAuthenticationDto) {
    return this.authenticationService.register(createAuthenticationDto);
  }

  @Post('login')
  login(@Body() login: Login_DTO) {
    return this.authenticationService.login(login);
  }

  @Get()
  findAll() {
    return this.authenticationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authenticationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuthenticationDto: UpdateAuthenticationDto,
  ) {
    return this.authenticationService.update(+id, updateAuthenticationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authenticationService.remove(+id);
  }
}
