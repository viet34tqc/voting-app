export class NominationDto {
  @IsString()
  @Length(1, 100)
  text: string;
}
