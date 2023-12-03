import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare, hash } from 'bcrypt';
import { roundOfHash } from 'src/common/constants';
import { UserEntity } from './entities/user.entity';
import { isNull, isUndefined } from 'util';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const formattedEmail = email.toLowerCase();
    await this.checkEmailUniqueness(formattedEmail);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        email: formattedEmail,
        password: await hash(password, roundOfHash),
      },
    });
    await this.prisma.credentials.create({
      data: {
        userId: user.id,
        version: 0,
        lastPassword: 'not_set',
        passwordUpdatedAt: new Date(),
      },
    });
    return user;
  }
  async checkEmailUniqueness(formattedEmail: string) {
    const count = await this.prisma.user.count({
      where: { email: formattedEmail },
    });
    if (count > 0) {
      throw new ConflictException('Email is in use');
    }
  }

  async checkUsernameUniqueness(username: string) {
    const count = await this.prisma.user.count({
      where: {
        username,
      },
    });
    if (count > 0) {
      throw new ConflictException('username is in use');
    }
  }

  findAll() {
    return this.prisma.user.findMany();
  }
  // find user by Id
  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        credential: true,
      },
    });
  }
  // // find user by email
  findOneByEmail(email: string) {
    const user = this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    return user;
  }
  // necessary for password reset
  uncheckedUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  throwUnauthorizedException(user: undefined | null | UserEntity): void {
    if (isUndefined(user) || isNull(user)) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async findOneByCredentials(
    userId: number,
    version: number,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { credential: true },
    });
    this.throwUnauthorizedException(user);
    if (user.credential.version !== version) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  public async findOneByUsername(username: string, forAuth = false) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (forAuth) {
      this.throwUnauthorizedException(user);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const { username } = updateUserDto;
    if (username) {
      this.checkUsernameUniqueness(username);
    }
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  async updatePassword(userId: number, oldPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { credential: true },
    });
    if (!(await compare(oldPass, user.password))) {
      throw new BadRequestException('Wrong password');
    }
    if (await compare(newPass, user.password)) {
      throw new BadRequestException('New password must be different');
    }
    // update credential
    await this.prisma.credentials.update({
      where: { userId },
      data: {
        version: user.credential.version + 1,
        lastPassword: user.password,
        passwordUpdatedAt: new Date(),
      },
    });
    const newPassHash = await hash(newPass, roundOfHash);
    const newUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPassHash,
      },
    });
    return newUser;
  }

  async resetPassword(userId: number, password: string, version: number) {
    const user = await this.findOneByCredentials(userId, version);
    // update credential
    await this.prisma.credentials.update({
      where: { userId },
      data: {
        version: user.credential.version + 1,
        lastPassword: user.password,
        passwordUpdatedAt: new Date(),
      },
    });
    const newPassHash = await hash(password, roundOfHash);
    const newUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPassHash,
      },
    });
    return newUser;
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
