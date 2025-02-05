import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateJobListingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  salaryMin: number;

  @IsNumber()
  @IsNotEmpty()
  salaryMax: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  requirements: string;

  @IsString()
  @IsOptional()
  perks?: string;
}

export class UpdateJobListingDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsNotEmpty()
  salaryMax?: number;

  @IsNumber()
  @IsNotEmpty()
  salaryMin?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  requirements?: string;

  @IsString()
  @IsOptional()
  perks?: string;
}
