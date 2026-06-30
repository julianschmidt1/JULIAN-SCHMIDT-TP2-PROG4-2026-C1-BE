import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findByIdentifier(identifier: string): Promise<UserDocument | null> {
    const normalizedIdentifier = identifier.trim().toLowerCase();

    return this.userModel
      .findOne({
        $or: [
          { email: normalizedIdentifier },
          { username: normalizedIdentifier },
        ],
      })
      .exec();
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().sort({ createdAt: -1 }).exec();

    return users.map((user) => this.toResponseDto(user));
  }

  findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username: username.trim() }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existingEmail = await this.findByEmail(createUserDto.email);

    if (existingEmail) {
      throw new ConflictException('Email is already in use');
    }

    const existingUsername = await this.findByUsername(createUserDto.username);

    if (existingUsername) {
      throw new ConflictException('Username is already in use');
    }

    const createdUser = new this.userModel(createUserDto);

    return createdUser.save();
  }

  async createByAdmin(
    createUserDto: AdminCreateUserDto,
    profileImageUrl: string,
  ): Promise<UserResponseDto> {
    const existingEmail = await this.findByEmail(createUserDto.email);

    if (existingEmail) {
      throw new ConflictException('Email is already in use');
    }

    const existingUsername = await this.findByUsername(createUserDto.username);

    if (existingUsername) {
      throw new ConflictException('Username is already in use');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = new this.userModel({
      ...createUserDto,
      email: createUserDto.email.toLowerCase().trim(),
      username: createUserDto.username.toLowerCase().trim(),
      password: passwordHash,
      birthDate: new Date(createUserDto.birthDate),
      profileImageUrl,
    });

    const savedUser = await createdUser.save();

    return this.toResponseDto(savedUser);
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
    profileImageUrl?: string,
  ): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId).exec();

    if (!user || !user.isActive) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.username) {
      const existingUsername = await this.findByUsername(
        updateUserDto.username,
      );

      if (existingUsername && existingUsername._id.toString() !== userId) {
        throw new ConflictException('Username is already in use');
      }

      user.username = updateUserDto.username.toLowerCase().trim();
    }

    if (updateUserDto.firstName !== undefined) {
      user.firstName = updateUserDto.firstName;
    }

    if (updateUserDto.lastName !== undefined) {
      user.lastName = updateUserDto.lastName;
    }

    if (updateUserDto.birthDate !== undefined) {
      user.birthDate = new Date(updateUserDto.birthDate);
    }

    if (updateUserDto.description !== undefined) {
      user.description = updateUserDto.description;
    }

    if (profileImageUrl !== undefined) {
      user.profileImageUrl = profileImageUrl;
    }

    const updatedUser = await user.save();

    return this.toResponseDto(updatedUser);
  }

  async disable(userId: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = false;

    const updatedUser = await user.save();

    return this.toResponseDto(updatedUser);
  }

  async restore(userId: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = true;

    const updatedUser = await user.save();

    return this.toResponseDto(updatedUser);
  }

  private toResponseDto(user: UserDocument): UserResponseDto {
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
