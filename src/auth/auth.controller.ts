import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UploadsService } from '../uploads/uploads.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedRequest } from './interfaces/authenticated-request.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
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
        'profileImage',
      ],
      properties: {
        firstName: { type: 'string', example: 'Juan' },
        lastName: { type: 'string', example: 'Perez' },
        email: { type: 'string', example: 'juan.perez@test.com' },
        username: { type: 'string', example: 'juanperez' },
        password: { type: 'string', example: 'Password123' },
        birthDate: { type: 'string', example: '1998-05-20' },
        description: { type: 'string', example: 'Usuario de prueba' },
        profileImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Profile image is required');
    }

    const uploadResult = await this.uploadsService.uploadImage(file);

    return this.authService.register(registerDto, uploadResult.secure_url);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Post('authorize')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  authorize(@Req() request: AuthenticatedRequest) {
    return request.user;
  }

  @ApiBearerAuth()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  refresh(@Req() request: AuthenticatedRequest) {
    return this.authService.refreshToken(request.user);
  }
}
