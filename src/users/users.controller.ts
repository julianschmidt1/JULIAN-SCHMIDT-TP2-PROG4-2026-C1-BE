import {
  Body,
  Controller,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UploadsService } from '../uploads/uploads.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Put(':id')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'Juan' },
        lastName: { type: 'string', example: 'Pérez' },
        username: { type: 'string', example: 'juanperez' },
        birthDate: { type: 'string', example: '1998-05-20' },
        description: { type: 'string', example: 'Nueva descripción' },
        profileImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async update(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let profileImageUrl: string | undefined;

    if (file) {
      const uploadResult = await this.uploadsService.uploadImage(file);
      profileImageUrl = uploadResult.secure_url;
    }

    return this.usersService.update(userId, updateUserDto, profileImageUrl);
  }
}
