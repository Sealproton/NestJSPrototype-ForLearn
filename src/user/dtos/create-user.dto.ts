import { IsEmail, IsString } from 'class-validator';

export class CreateUsetDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
