import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsMongoId, IsOptional, IsString } from 'class-validator';

export class GetPostsQueryDto {
  @ApiPropertyOptional({
    example: 'createdAt',
    enum: ['createdAt', 'likes'],
  })
  @IsOptional()
  @IsIn(['createdAt', 'likes'])
  sort?: 'createdAt' | 'likes';

  @ApiPropertyOptional({
    example: '0',
  })
  @IsOptional()
  @IsString()
  offset?: string;

  @ApiPropertyOptional({
    example: '10',
  })
  @IsOptional()
  @IsString()
  limit?: string;

  @ApiPropertyOptional({
    example: '6a35d33bfd0950f93baec53c',
  })
  @IsOptional()
  @IsMongoId()
  userId?: string;
}
