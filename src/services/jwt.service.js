import "dotenv/config";
import jwt from "jsonwebtoken";

class JWTService {
  async generateJWT(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "3m",
    });

    return token;
  }

  async validateJWT(req) {
    const authHeader = req.headers["authorization"];

    jwt.verify(
      authHeader ? authHeader.split(" ")[1] : req.param.token,
      process.env.JWT_SECRET_KEY,
      (err, user) => {
        if (err) {
          return "TOKEN KHÔNG HỢP LỆ HOẶC TOKEN HẾT HẠN";
        }

        return user;
      },
    );
  }
}

export default new JWTService();
