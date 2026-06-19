/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { Inject, Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as Cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CLOUDINARY } from './cloudinary/cloudinary.constants';

@Injectable()
export class UploadsService {
  constructor(
    @Inject(CLOUDINARY)
    private readonly cloudinary: typeof Cloudinary,
  ) {}

  uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'red-social',
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result as UploadApiResponse);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
