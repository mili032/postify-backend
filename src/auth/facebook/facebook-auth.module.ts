import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FacebookAuthController } from './facebook-auth.controller';
import { FacebookAuthService } from './facebook-auth.service';

@Module({
  imports: [HttpModule],
  controllers: [FacebookAuthController],
  providers: [FacebookAuthService],
})
export class FacebookAuthModule {}
