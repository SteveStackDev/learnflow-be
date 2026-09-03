import "dotenv/config";
import jwt from "jsonwebtoken";

class JWTService {
  generateJWT(payload, expiresIn = "3m") {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn,
    });
  }

  validateJWT(req) {
    try {
      const authHeader = req.headers?.["authorization"];
      const token =
        authHeader && authHeader.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : req.body?.token || req.query?.token || req.params?.token;

      if (!token) return null;

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      return decoded;
    } catch (err) {
      console.warn("JWT validation failed:", err.message);
      return null;
    }
  }
}

export default new JWTService();
