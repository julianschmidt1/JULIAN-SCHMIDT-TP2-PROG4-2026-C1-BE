/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'juanperez',
    description: 'Email or username',
  })
  @IsString()
  identifier!: string;

  @ApiProperty({
    example: 'Password123',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
