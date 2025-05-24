import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { FacebookAuthService } from './facebook-auth.service';
import { FacebookPagesService } from './facebook-pages.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth/facebook')
export class FacebookAuthController {
  constructor(
    private readonly fbAuthService: FacebookAuthService,
    private readonly pagesService: FacebookPagesService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') token: string, // JWT token dolazi ovde
    @Res() res: Response,
  ) {
    let userId: number | null = null;

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      userId = decoded?.id;
    } catch (err) {
      console.error('Invalid token in state param');
      return res.status(401).send('Unauthorized');
    }

    const accessToken =
      await this.fbAuthService.exchangeCodeForAccessToken(code);
    const pages = await this.fbAuthService.getUserPages(accessToken);

    if (userId) {
      await this.pagesService.savePages(userId, pages);
    }

    return res.redirect(`http://localhost:3001/facebook`);
  }
}
