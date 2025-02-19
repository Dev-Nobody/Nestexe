import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  role?: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  // @IsString()
  // @IsNotEmpty()
  // profileImage?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' }) // Ensures only numbers
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' }) // Enforces length
  phoneNumber: string;
}

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
