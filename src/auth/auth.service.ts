import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(
    registerDto: RegisterDto,
    profileImageUrl: string,
  ): Promise<UserResponseDto> {
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const createUserDto: CreateUserDto = {
      ...registerDto,
      password: passwordHash,
      profileImageUrl,
    };

    const user = await this.usersService.create(createUserDto);

    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      birthDate: user.birthDate,
      description: user.description,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async login(loginDto: LoginDto): Promise<UserResponseDto> {
    const user = await this.usersService.findByIdentifier(loginDto.identifier);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      birthDate: user.birthDate,
      description: user.description,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
