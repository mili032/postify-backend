import { Controller, Get, Query } from '@nestjs/common';
import { PagesService } from './pages.service';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  findOne(@Query('slug') slug: string) {
    return this.pagesService.findOne(slug);
  }
}
