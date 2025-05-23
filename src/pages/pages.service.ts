import { Injectable } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  private readonly pages = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      slug: 'dashboard',
      description: 'Pratite sve važne informacije na jednom mestu',
    },
    {
      id: 'facebook',
      title: 'Facebook',
      slug: 'facebook',
      description: 'Dodajte, izmenite ili obrišite Facebook stranicu',
    },
  ];

  findOne(slug: string) {
    const page = this.pages.find((page) => page.slug === slug);
    if (!page) {
      return null;
    }
    return {
      title: page.title,
      slug: page.slug,
      description: page.description,
      id: page.id,
    };
  }
}
