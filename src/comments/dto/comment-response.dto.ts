export class CommentResponseDto {
  id!: string;
  post!: string;
  message!: string;
  modified!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  author!: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    profileImageUrl?: string;
  };
}
