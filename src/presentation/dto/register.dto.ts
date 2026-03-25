import {
  IsString,
  IsEmail,
  MinLength,
  IsIn,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn(['admin', 'merchant'])
  role?: 'admin' | 'merchant';
}
