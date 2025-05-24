import { Controller } from '@nestjs/common';
import { FacebookPagesService } from './facebook-pages.service';

@Controller('facebook-pages')
export class FacebookPagesController {
  constructor(private readonly fbPagesService: FacebookPagesService) {}
}
