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

    return {
      id: updatedUser._id.toString(),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      username: updatedUser.username,
      birthDate: updatedUser.birthDate,
      description: updatedUser.description,
      profileImageUrl: updatedUser.profileImageUrl,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
