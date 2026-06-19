import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
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
}
