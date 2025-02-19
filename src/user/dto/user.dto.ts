import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' }) // Ensures only numbers
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' }) // Enforces length
  phoneNumber: string;

  //   @IsNotEmpty()
  //   @IsOptional()
  //   profileImage?: Express.Multer.File;
}
