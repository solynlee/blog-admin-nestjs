import { IsNotEmpty, IsString } from 'class-validator';

export class UploadDto {
  @IsNotEmpty()
  @IsString()
  filename: string;
}
