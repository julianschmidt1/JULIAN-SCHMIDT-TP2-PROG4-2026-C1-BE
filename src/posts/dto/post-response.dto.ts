export class PostAuthorResponseDto {
  id!: string;
  firstName!: string;
  lastName!: string;
  username!: string;
  profileImageUrl!: string;
}

export class PostResponseDto {
  id!: string;
  title!: string;
  description!: string;
  imageUrl?: string;
  author!: PostAuthorResponseDto;
  likes!: number;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  likedByCurrentUser!: boolean;
}
