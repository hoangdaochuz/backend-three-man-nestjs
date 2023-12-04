import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'After user register success a account. We will receive a email to confirm. It contains token. FE should create an URL to handle it. Currently, I hard code this URL "https://my-app.com/comfirm?token=....", When user click this URL, redirect to a page which is handle in FE. Then using token and make a request to this api',
  })
  @ApiOkResponse({
    type: 'Noti',
    description: 'The password has been confirm',
  })
  async comfirm(@Body() comfirmData: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      comfirmData.token,
    );
    return await this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: 'Noti',
    description: 'confirmation-link has been sent',
  })
  async resendConfirmationLink(@Request() req) {
    return await this.emailConfirmationService.resendConfirmationLink(
      req.user.id,
    );
  }
}
