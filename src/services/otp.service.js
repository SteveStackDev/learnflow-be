import otpGenerator from "otp-generator";
import { redisClient } from "#configs/redis.js";

let OTPStorage = redisClient;
const MAX_OTP_ATTEMPTS = 3;

class OTPService {
  async generateOTP(email) {
    try {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      await OTPStorage.set(`otp:${email}`, otp, { PX: 1000 * 60 * 3 });
      await OTPStorage.set(`otp_attempts:${email}`, MAX_OTP_ATTEMPTS, {
        PX: 1000 * 60 * 3,
      });

      return otp;
    } catch (error) {
      console.log(error.message);
    }
  }

  async validateOTP(email, otp) {
    try {
      const storedOTP = await OTPStorage.get(`otp:${email}`);

      if (!storedOTP) {
        await OTPStorage.del(`otp_attempts:${email}`);
        return "OTP đã hết hạn";
      } else if (otp !== storedOTP) {
        const remainingOTPAttempts = await OTPStorage.decr(
          `otp_attempts:${email}`,
        );
        if (remainingOTPAttempts <= 0) {
          await OTPStorage.del([`otp:${email}`, `otp_attempts:${email}`]);
          return "Đã hết lượt nhập OTP";
        }

        return "OTP không hợp lệ";
      }

      await OTPStorage.del([`otp:${email}`, `otp_attempts:${email}`]);

      return "OTP hợp lệ";
    } catch (error) {
      console.log(error.message);
    }
  }
}

export default new OTPService();
