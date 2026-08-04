import cloudinary from "#configs/cloudinary.js";
import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import path from "path";
import Randomstring from "randomstring";

class UploadService {
  async uploadFile(filePath, folderName, resourceType, originalName) {
    try {
      const options = {
        folder: folderName,
        resource_type: resourceType,
      };

      if (resourceType === "raw" && originalName) {
        const ext = path.extname(originalName);

        options.public_id = `${Randomstring.generate()}${ext}`;
      }

      const result = await cloudinary.uploader.upload(filePath, options);

      return {
        url: result.secure_url,
        url_id: result.public_id,
      };
    } catch (error) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Cloudinary tải lên thất bại. Lỗi: ${error.message}`,
      );
    }
  }

  async deleteFile(publicId, resourceType) {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    } catch (error) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Cloudinary xóa thất bại. Lỗi: ${error.message}`,
      );
    }
  }
}

export default new UploadService();
