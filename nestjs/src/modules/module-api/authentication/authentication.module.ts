import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { GoogleStrategy } from 'src/common/strategyAuthentication/google.strategy';
import { FacebookStrategy } from 'src/common/strategyAuthentication/facebook.strategy';
import { GithubStrategy } from 'src/common/strategyAuthentication/github.strategy';
import { TokenModule } from 'src/modules/module-system/token/token.module';
import { PrismaService } from 'src/modules/module-system/prisma/prisma.service';

@Module({
  imports: [TokenModule],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    GoogleStrategy,
    FacebookStrategy,
    GithubStrategy,
  ],
})
export class AuthenticationModule {}
