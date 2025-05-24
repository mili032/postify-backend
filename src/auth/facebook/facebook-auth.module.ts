import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FacebookAuthController } from './facebook-auth.controller';
import { FacebookAuthService } from './facebook-auth.service';
import { FacebookPagesService } from './facebook-pages.service';
import { PrismaService } from '../../prisma';
import { FacebookPagesModule } from './facebook-pages.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HttpModule, FacebookPagesModule],
  controllers: [FacebookAuthController],
  providers: [
    FacebookAuthService,
    FacebookPagesService,
    PrismaService,
    JwtService,
  ],
})
export class FacebookAuthModule {}
