import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailResetPasswordDto } from './mail.dto';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  async kirimLupaSandi(payload: MailResetPasswordDto) {
    await this.mailService.sendMail({
      to: payload.email,
      subject: 'Lupa Passowrd',
      template: './lupa_password',
      context: {
        link: payload.link,
        name: payload.name,
      },
    });
  }
}
