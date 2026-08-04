import "dotenv/config";
import transporter from "#configs/nodemailer.js";

class MailService {
  async sendMail(receiverEmail, subject, html, context) {
    try {
      const mailData = {
        from: process.env.GOOGLE_NODEMAILER_USER_EMAIL,
        to: receiverEmail,
        subject,
        html,
        context,
      };

      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          console.log(error.message);
          return;
        }

        return info;
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}

export default new MailService();
