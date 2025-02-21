import Asset from "../model/assets.js";
import cloudinary from "../utils/cloudinary.js";

const uploadAsset = async (req, res) => {
  const { fileName } = req.body;
  try {
    let imgUrl = null;
    let publicId = null; // Add publicId variable

    if (req.file) {
      console.log("got file");
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: `assets/${fileName}`,
              folder: "assets",
              transformation: {
                quality: "auto",
                fetch_format: "auto",
              },
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      imgUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id; // Save the public_id from Cloudinary
    }

    // Create the new Asset object with publicId
    const newAsset = new Asset({
      fileName: fileName,
      userId: req.params.userId,
      url: imgUrl,
      type: req.body.type,
      publicId, // Add publicId field if it's necessary for your use case
    });

    await newAsset.save();
    res.status(201).json(newAsset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAssetByUserId = async (req, res) => {
  try {
    const assets = await Asset.find({ userId: req.params.userId });
    res.status(200).json(assets);
    console.log(assets);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export { uploadAsset, getAssetByUserId };
