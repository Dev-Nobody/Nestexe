import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class ApplicationDto {
  // @IsNumber()
  // @IsNotEmpty()
  // userId: number;

  @IsNumber()
  @IsNotEmpty()
  jobId: number;

  // @IsString()
  // @IsNotEmpty()
  // applicationStatus: string;
}

export class checkApplicationDto {
  @IsString()
  @IsNotEmpty()
  applicationStatus: string;

  @IsNumber()
  @IsNotEmpty()
  ApplicationId: number;
}
