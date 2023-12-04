import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}
  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { username } });
    if (user && (await compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }

  async login(user: Partial<User>) {
    const payload = { username: user.username, sub: user.id };
    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async registerUser(body: CreateUserDto) {
    const result = new UserEntity(await this.userService.create(body));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = result;
    const payload = { username: user.username, sub: user.id };
    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
  async refreshToken(user: Partial<User>) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  googleLogin(req: any) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async decodeResetPassConfirmToken(token: string) {
    console.log('🚀 ~ f----> decodeResetPassConfirmToken ~ token:', token);
    try {
      const payload = await this.jwtService.verify(token, {
        secret: `${process.env.JWT_RESET_PASSWORD_TOKEN_SECRET}`,
      });
      console.log('🚀 ---> ~ payload:', payload);

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (e) {
      console.error(e);
      if (e?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async doResetPassword(email: string, newPass: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new BadRequestException('User is not exist');
    await this.userService.resetPasswordWithNewPassOfUser(user.id, {
      password: newPass,
    });
  }
}
