import nodemailer from 'nodemailer';
import mailConfing from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfing;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfing.default,
      ...message
    });
  }
}

export default new Mail();
