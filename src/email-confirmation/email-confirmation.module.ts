import { Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { EmailConfirmationController } from './email-confirmation.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [EmailConfirmationService],
  imports: [
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: {
        expiresIn: '5m',
      },
    }),
    EmailModule,
    UsersModule,
  ],
  exports: [EmailConfirmationService],
  controllers: [EmailConfirmationController],
})
export class EmailConfirmationModule {}
