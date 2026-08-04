export const getFileType = (mimeType) => {
  if (!mimeType || typeof mimeType !== "string") return "file";

  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("aplication/")) return "file";

  return "file";
};
