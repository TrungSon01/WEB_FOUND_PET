import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @IsNotEmpty()
  @IsNumber()
  receiverId: number;

  @IsNotEmpty()
  @IsString()
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
