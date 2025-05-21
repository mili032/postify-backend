import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FacebookAuthService {
  constructor(private readonly httpService: HttpService) {}

  async exchangeCodeForAccessToken(code: string): Promise<string> {
    const clientId = '1296600068696051';
    const clientSecret = '42bbcaa03071496bbfa94dc706f270c0';
    const redirectUri = 'https://tvoj-domen/api/auth/facebook/callback';

    const response = await firstValueFrom(
      this.httpService.post(
        'https://graph.facebook.com/v19.0/oauth/access_token',
        null,
        {
          params: {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code,
          },
        },
      ),
    );

    return response.data.access_token;
  }

  async getUserPages(accessToken: string) {
    const response = await firstValueFrom(
      this.httpService.get('https://graph.facebook.com/me/accounts', {
        params: {
          access_token: accessToken,
        },
      }),
    );

    return response.data;
  }
}
