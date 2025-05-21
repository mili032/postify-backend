import { Controller, Get, Query } from '@nestjs/common';
import { FacebookAuthService } from './facebook-auth.service';

@Controller('api/auth/facebook')
export class FacebookAuthController {
  constructor(private readonly fbAuthService: FacebookAuthService) {}

  @Get('callback')
  async handleCallback(@Query('code') code: string) {
    const accessToken =
      await this.fbAuthService.exchangeCodeForAccessToken(code);
    const pages = await this.fbAuthService.getUserPages(accessToken);
    return { accessToken, pages };
  }
}
