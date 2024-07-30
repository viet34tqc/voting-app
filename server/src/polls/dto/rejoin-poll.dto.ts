import { IsString, Length } from 'class-validator';

export class RejoinPollDto {
  @IsString()
  @Length(6, 6)
  userId: string;

  @IsString()
  @Length(6, 6)
  pollId: string;

  @IsString()
  @Length(1, 25)
  name: string;
}
