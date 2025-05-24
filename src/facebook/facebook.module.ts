import { Module } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { FacebookController } from './facebook.controller';
import { PrismaService } from '../prisma';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [FacebookController],
  providers: [FacebookService, PrismaService, JwtService],
  imports: [HttpModule],
})
export class FacebookModule {}
