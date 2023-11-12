import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AppService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const smtpConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'sakunbelajar4@gmail.com',
        pass: 'azjwfjramlccwvfv',
      },
    };

    this.transporter = nodemailer.createTransport(smtpConfig);
  }

  async sendMail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: 'sakunbelajar4@gmail.com',
      to,
      subject,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
