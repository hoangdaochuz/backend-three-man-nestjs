import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailConfirmationService } from './email-confirmation.service';
import ConfirmEmailDto from './dto/confirmEmail.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('email-confirmation')
@ApiTags('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}
  @Post('comfirm')
  async comfirm(@Body() comfirmData: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      comfirmData.token,
    );
    await this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@Request() req) {
    await this.emailConfirmationService.resendConfirmationLink(req.user.id);
  }
}
