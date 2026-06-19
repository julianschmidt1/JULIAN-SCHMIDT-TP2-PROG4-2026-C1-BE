import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, UploadsModule],
})
export class AuthModule {}
