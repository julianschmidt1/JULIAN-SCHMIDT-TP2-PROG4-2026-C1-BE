import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'Titulo publicacion',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title!: string;

  @ApiProperty({
    example: 'Ejemplodescripcion',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  description!: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: Express.Multer.File;
}
