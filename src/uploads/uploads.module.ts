import { Module } from '@nestjs/common';

import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { UploadsService } from './uploads.service';

@Module({
  providers: [UploadsService, CloudinaryProvider],
  exports: [UploadsService],
  controllers: [],
})
export class UploadsModule {}
