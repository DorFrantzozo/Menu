import Asset from "../model/assets.js";
import { AssetFolder, uploadTenantAsset } from "../utils/cloudinary.js";

const uploadAsset = async (req, res) => {
  const { fileName } = req.body;
  const { userId } = req.params;

  try {
    // url/publicId are required by the schema, so a file is mandatory
    if (!userId || !fileName || !req.file) {
      return res
        .status(400)
        .json({ message: "userId, fileName and a file are required" });
    }

    // Build the document (unsaved) — its _id is the asset's storage path
    const newAsset = new Asset({
      fileName,
      userId,
      url: null,
      type: req.body.type,
      publicId: null,
    });

    const uploadResult = await uploadTenantAsset({
      buffer: req.file.buffer,
      userId,
      folder: AssetFolder.ASSETS,
      publicId: newAsset._id,
      displayName: fileName,
      // Assets are design elements (icons, backgrounds) — delivered at full size
      transformation: {
        quality: "auto",
        fetch_format: "auto",
      },
    });

    newAsset.url = uploadResult.secure_url;
    newAsset.publicId = uploadResult.public_id;

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
