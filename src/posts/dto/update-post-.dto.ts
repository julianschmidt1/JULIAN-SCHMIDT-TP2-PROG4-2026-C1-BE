import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

const emptyStringToUndefined = ({ value }: { value: unknown }) =>
  value === '' ? undefined : value;

export class UpdatePostDto {
  @ApiPropertyOptional({ example: 'Titulo actualizado' })
  @Transform(emptyStringToUndefined)
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ example: 'Descripcion actualizada' })
  @Transform(emptyStringToUndefined)
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: Express.Multer.File;
}
