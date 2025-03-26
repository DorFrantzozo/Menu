import QRCode from "qrcode";

export const generateQRCode = async (userName) => {
  const url = `${userName}.menuyou.online/menu`;
  const qrUrl = await QRCode.toDataURL(url);
  console.log(qrUrl);
  return qrUrl;
};
