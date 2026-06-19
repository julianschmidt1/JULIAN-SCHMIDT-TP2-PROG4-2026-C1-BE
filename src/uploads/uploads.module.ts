import { Module } from '@nestjs/common';

import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';

@Module({
  providers: [UploadsService, CloudinaryProvider],
  exports: [UploadsService],
  controllers: [UploadsController],
})
export class UploadsModule {}
