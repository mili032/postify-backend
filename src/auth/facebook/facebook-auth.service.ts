import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FacebookAuthService {
  constructor(private readonly httpService: HttpService) {}

  async exchangeCodeForAccessToken(code: string): Promise<string> {
    const client_id = process.env.FACEBOOK_APP_ID;
    const client_secret = process.env.FACEBOOK_APP_SECRET;
    const redirect_uri =
      'https://api.twibbio.com/api/v1/auth/facebook/callback';

    const response = await firstValueFrom(
      this.httpService.post(
        'https://graph.facebook.com/v19.0/oauth/access_token',
        null,
        {
          params: {
            client_id: client_id,
            client_secret: client_secret,
            redirect_uri: redirect_uri,
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

    return response.data.data;
  }
}
