import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class FacebookPagesService {
  constructor(private readonly prisma: PrismaService) {}

  async savePages(userId: number, pages: any[]) {
    const data = pages.map((page) => ({
      userId,
      pageId: page.id,
      name: page.name,
      accessToken: page.access_token,
      tasks: page.tasks,
    }));

    for (const page of data) {
      await this.prisma.facebookPage.upsert({
        where: {
          userId_pageId: {
            userId: page.userId,
            pageId: page.pageId,
          },
        },
        update: {
          name: page.name,
          accessToken: page.accessToken,
          tasks: page.tasks,
        },
        create: page,
      });
    }
  }
}
