import { ConfigService } from '@nestjs/config';
import { v2 as Cloudinary } from 'cloudinary';

import { CLOUDINARY } from './cloudinary.constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (configService: ConfigService) => {
    Cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });

    return Cloudinary;
  },
  inject: [ConfigService],
};
