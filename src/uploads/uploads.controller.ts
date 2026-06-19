import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@Controller('uploads')
@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('test')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async testUpload(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadsService.uploadImage(file);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }
}
