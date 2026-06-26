import {
  Body,
  Controller,
  Put,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
  Get,
  BadRequestException,
  Post,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { UploadsService } from '../uploads/uploads.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadsService: UploadsService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'firstName',
        'lastName',
        'email',
        'username',
        'password',
        'birthDate',
        'description',
        'role',
        'profileImage',
      ],
      properties: {
        firstName: { type: 'string', example: 'Juan' },
        lastName: { type: 'string', example: 'Perez' },
        email: { type: 'string', example: 'juan.perez@test.com' },
        username: { type: 'string', example: 'juanperez' },
        password: { type: 'string', example: 'Password123' },
        birthDate: { type: 'string', example: '1998-05-20' },
        description: {
          type: 'string',
          example: 'Usuario creado por administrador',
        },
        role: {
          type: 'string',
          enum: ['user', 'administrator'],
          example: 'user',
        },
        profileImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createByAdmin(
    @Body() createUserDto: AdminCreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Profile image is required');
    }

    const uploadResult = await this.uploadsService.uploadImage(file);

    return this.usersService.createByAdmin(
      createUserDto,
      uploadResult.secure_url,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  disable(@Param('id') userId: string) {
    return this.usersService.disable(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/restore')
  restore(@Param('id') userId: string) {
    return this.usersService.restore(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: AuthenticatedRequest,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let profileImageUrl: string | undefined;

    if (file) {
      const uploadResult = await this.uploadsService.uploadImage(file);
      profileImageUrl = uploadResult.secure_url;
    }

    return this.usersService.update(
      request.user.sub,
      updateUserDto,
      profileImageUrl,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
