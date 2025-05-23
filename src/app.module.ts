import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { FacebookAuthModule } from './auth/facebook/facebook-auth.module';
import { UsersService, UsersModule, UsersController } from './users';
import { PrismaService } from './prisma';
import { PagesModule } from './pages/pages.module';

@Module({
  imports: [HttpModule, FacebookAuthModule, UsersModule, PagesModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, PrismaService],
})
export class AppModule {}
