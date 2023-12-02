import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  sex: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  role: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  loginType: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  status: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  verified: boolean;
}
