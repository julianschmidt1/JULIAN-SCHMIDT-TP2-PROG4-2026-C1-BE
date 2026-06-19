/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({ example: 'Julian' })
  firstName!: string;

  @IsString()
  @MinLength(2)
  @ApiProperty({ example: 'Schmidt' })
  lastName!: string;

  @IsEmail()
  @ApiProperty({ example: 'ejemplo@mail.com' })
  email!: string;

  @IsString()
  @MinLength(3)
  @ApiProperty({ example: 'ejemplouser' })
  username!: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase letter and one number',
  })
  @ApiProperty({ example: 'Password123' })
  password!: string;

  @IsDateString()
  @ApiProperty({ example: '1999-06-09' })
  birthDate!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  @ApiPropertyOptional({ example: 'ejemplodescripcion' })
  description?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
