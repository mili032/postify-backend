import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { response } from '../common/utils';

@Controller('facebook')
export class FacebookController {
  constructor(
    private readonly facebookService: FacebookService,
    private readonly httpService: HttpService,
  ) {}

  @Get(`/all-pages`)
  findAll(@Headers('authorization') authorization: string) {
    return this.facebookService.findAll(authorization);
  }

  @Get(`page/:pageId`)
  async findOne(@Param('pageId') pageId: string) {
    const page = await this.facebookService.findOne(pageId);
    if (!page) {
      throw new UnauthorizedException('Page not found.');
    }

    return page;
  }

  @Get(`page/:pageId/all-posts`)
  async findAllPosts(@Param('pageId') pageId: string) {
    const page = await this.facebookService.findOne(pageId);

    if (!page) {
      throw new UnauthorizedException('Page token not found.');
    }

    const {
      payload: {
        local: { pageId: id, accessToken: access_token },
      },
    } = page;

    const url = `https://graph.facebook.com/v19.0/${id}/posts`;

    const res = await firstValueFrom(
      this.httpService.get(url, {
        params: {
          access_token: access_token,
        },
      }),
    );

    return response.success(res.data.data, 'Posts fetched successfully');
  }

  @Post(`:pageId/post`)
  async publish(
    @Param('pageId') pageId: string,
    @Body() body: { message: string },
  ) {
    const page = await this.facebookService.findOne(pageId);

    if (!page) {
      throw new UnauthorizedException('Page token not found.');
    }

    const {
      payload: {
        local: { pageId: id, accessToken: access_token },
      },
    } = page;

    const url = `https://graph.facebook.com/v19.0/${id}/feed`;
    const response = await firstValueFrom(
      this.httpService.post(url, {
        message: body.message,
        access_token: access_token,
      }),
    );

    return response.data;
  }
}
