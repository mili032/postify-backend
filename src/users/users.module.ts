import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  exports: [UsersService, JwtModule],
})
export class UsersModule {}
