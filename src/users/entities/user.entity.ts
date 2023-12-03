import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { CredentialEntity } from './credential.entity';

export class UserEntity implements User {
  // remove these field which is unnecessary to show
  constructor({ credential, ...data }: Partial<UserEntity>) {
    Object.assign(this, data);
    if (credential) {
      this.credential = new CredentialEntity(credential);
    }
  }
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @Exclude() // remove these field which is unnecessary to show
  password: string;

  @ApiProperty()
  sex: boolean;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  loginType: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  verified: boolean;

  @ApiProperty()
  credential?: CredentialEntity;
}
