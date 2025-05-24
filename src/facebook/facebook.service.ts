import { Injectable } from '@nestjs/common';
import { CreateFacebookDto } from './dto/create-facebook.dto';
import { UpdateFacebookDto } from './dto/update-facebook.dto';
import { PrismaService } from '../prisma';
import { response } from '../common/utils';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FacebookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(authorization: string) {
    if (!authorization) {
      return response.error('Nemate pristup.', 401);
    }

    const token = authorization.split(' ')[1];

    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    if (!decoded || !decoded.id) {
      return response.error('Neispravan token.', 401);
    }

    const { id: user_id } = decoded;

    // Proveri da li korisnik postoji
    const user = await this.prisma.users.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      return response.error('Korisnik ne postoji.', 404);
    }

    // Dobij sve Facebook stranice korisnika
    const all_pages = await this.prisma.facebookPage.findMany({
      where: {
        userId: user_id,
      },
    });

    if (!all_pages) {
      return response.error('Ovaj korisnik nema stranice', 404);
    }

    const pages = (all_pages ?? [])?.map((page) => ({
      id: page.id,
      name: page.name,
      accessToken: page.accessToken,
      tasks: page.tasks,
    }));

    if (pages.length === 0) {
      return response.error('Ovaj korisnik nema stranice', 404);
    }

    return response.success(pages, 'Stranice uspešno dobijene');
  }

  async findOne(page_id: string) {
    let id = parseInt(page_id);

    if (!page_id) {
      return response.error('Nemate pristup.', 401);
    }

    if (isNaN(id)) {
      return response.error('ID nije validan.', 400);
    }

    const page = await this.prisma.facebookPage.findFirst({
      where: {
        id,
      },
    });

    if (!page?.pageId) {
      return response.error('Stranica ne postoji.', 404);
    }

    const { pageId, accessToken: access_token } = page;

    const facebook_page = await firstValueFrom(
      this.httpService.get(`https://graph.facebook.com/v19.0/${pageId}`, {
        params: {
          access_token: access_token,
          fields:
            'id,name,access_token,picture{url},fan_count,about,description,link,category,cover,location,hours,website,phone,emails',
        },
      }),
    );

    if (!facebook_page?.data) {
      return response.error('Greška prilikom dobijanja stranice.', 500);
    }

    return response.success(
      {
        local: { ...page },
        facebook: { ...facebook_page.data },
      },
      'Stranica uspešno dobijena',
    );
  }
}
