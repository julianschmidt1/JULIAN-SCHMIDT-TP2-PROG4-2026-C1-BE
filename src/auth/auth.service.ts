import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
    profileImageUrl: string,
  ): Promise<LoginResponseDto> {
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const createUserDto: CreateUserDto = {
      ...registerDto,
      password: passwordHash,
      profileImageUrl,
    };

    const user = await this.usersService.create(createUserDto);

    const userResponse: UserResponseDto = {
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

    const payload: JwtPayload = {
      sub: userResponse.id,
      email: userResponse.email,
      username: userResponse.username,
      role: userResponse.role,
    };

    return {
      user: userResponse,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByIdentifier(loginDto.identifier);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is disabled');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userResponse: UserResponseDto = {
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

    const payload: JwtPayload = {
      sub: userResponse.id,
      email: userResponse.email,
      username: userResponse.username,
      role: userResponse.role,
    };

    return {
      user: userResponse,
      accessToken: this.jwtService.sign(payload),
    };
  }

  refreshToken(payload: JwtPayload): { accessToken: string } {
    const newPayload: JwtPayload = {
      sub: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    };

    return {
      accessToken: this.jwtService.sign(newPayload),
    };
  }
}
