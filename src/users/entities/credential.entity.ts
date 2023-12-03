import { ApiProperty } from '@nestjs/swagger';
import { Credentials } from '@prisma/client';
import { Exclude } from 'class-transformer';
export class CredentialEntity implements Credentials {
  constructor(patial: Partial<CredentialEntity>) {
    Object.assign(this, patial);
  }
  @ApiProperty()
  id: number;

  @ApiProperty()
  version: number;

  @Exclude()
  lastPassword: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  passwordUpdatedAt: Date;
}
