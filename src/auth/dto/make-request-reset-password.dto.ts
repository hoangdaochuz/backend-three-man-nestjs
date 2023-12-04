import { IsNotEmpty, IsString } from 'class-validator';

export class MakeRequestResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
