import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPwDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
