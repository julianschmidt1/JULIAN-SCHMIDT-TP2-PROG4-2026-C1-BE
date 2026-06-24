/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

const emptyStringToUndefined = ({ value }: { value: unknown }) =>
  value === '' ? undefined : value;

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Juan' })
  @Transform(emptyStringToUndefined)
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Pérez' })
  @Transform(emptyStringToUndefined)
  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @ApiPropertyOptional({ example: 'juanperez' })
  @Transform(emptyStringToUndefined)
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @ApiPropertyOptional({ example: '1998-05-20' })
  @Transform(emptyStringToUndefined)
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 'Nueva descripción del usuario' })
  @Transform(emptyStringToUndefined)
  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  profileImage?: Express.Multer.File;
}
