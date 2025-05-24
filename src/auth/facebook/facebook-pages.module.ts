import { Module } from '@nestjs/common';
import { FacebookPagesService } from './facebook-pages.service';
import { FacebookPagesController } from './facebook-pages.controller';
import { PrismaService } from 'src/prisma';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [FacebookPagesController],
  providers: [FacebookPagesService, PrismaService, JwtService],
  exports: [FacebookPagesService],
})
export class FacebookPagesModule {}
