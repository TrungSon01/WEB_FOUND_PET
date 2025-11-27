import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  @IsNumber()
  @IsNotEmpty()
  receiverId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateMessageDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  content?: string;
}

export class GetConversationDto {
  @IsNotEmpty()
  @IsNumber()
  userId1: number;

  @IsNotEmpty()
  @IsNumber()
  userId2: number;
}
