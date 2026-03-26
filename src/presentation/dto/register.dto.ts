import {
  IsString,
  IsEmail,
  MinLength,
  IsIn,
  IsOptional,
} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsIn(['admin', 'merchant'])
  role?: 'admin' | 'merchant';
}
