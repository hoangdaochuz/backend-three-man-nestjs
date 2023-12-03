import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { FacebbokGuard } from './guards/facebook.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailConfirmService: EmailConfirmationService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    console.log('aaaa');
    const user = await this.authService.registerUser(body);
    await this.emailConfirmService.sendVerificationLink(user.email);
    return user;
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @Get('login/googleoauth')
  @UseGuards(GoogleOAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Request() req) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }

  @Get('login/facebook')
  @UseGuards(FacebbokGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  facebookLoging(@Request() req) {}

  @Get('facebook/redirect')
  // @UseGuards(FacebbokGuard)
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Request() req) {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }
}
