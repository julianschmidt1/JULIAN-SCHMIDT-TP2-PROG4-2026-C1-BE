import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message!: string;
}
