import { UserRole } from '../enums/user-role.enum';

export class UserResponseDto {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  username!: string;
  birthDate!: Date;
  description!: string;
  profileImageUrl!: string;
  role!: UserRole;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
