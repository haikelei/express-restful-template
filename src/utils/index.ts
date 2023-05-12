import path from "path";
import axios from "axios";
import jimp from "jimp";
export function sendResponse(options) {
  if (options.type === "Success") {
    return Promise.resolve({
      message: options.message ?? null,
      data: options.data ?? null,
      status: options.type,
    });
  }
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({
    message: options.message ?? "Failed",
    data: options.data ?? null,
    status: options.type,
  });
}
/**
 * 上传发布社区的图片到本地文件夹
 * @param imageUrl
 */
export async function uploadPostImageToLocal(imageUrl) {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  const imageBuffer = Buffer.from(response.data, "binary");
  const fileName = `${Date.now()}.png`;
  const targetPath = path.join(
    process.env.FILE_DIR || "",
    "post_images",
    fileName
  );

  const image = await jimp.read(imageBuffer);
  await image.writeAsync(targetPath);

  return fileName;
}
export function generateImageUrlFromFileName(fileName) {
  const fileServer = process.env.FILE_SERVER;
  return `${fileServer}/post_images/${fileName}`;
}
