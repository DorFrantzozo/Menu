import User from "../model/user.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";
import { expirationTime, generateToken } from "../utils/jwt.js";

const createUser = async (req, res) => {
  const { email, password, restaurantName } = req.body;

  if (!email || !password || !restaurantName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let logoUrl = null;

    // Handle image upload to Cloudinary if file is present
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: `users/${email}_logo`,
              folder: "users", // Store the image in the "users" folder
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
      logoUrl = uploadResult.secure_url; // Get the Cloudinary secure URL for the logo
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user instance
    const newUser = new User({
      email,
      password: hashedPassword,
      restaurantName,
      logo: logoUrl,
      designNumber: 1,
    });

    await newUser.save();

    const token = generateToken(newUser);

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({ user: userWithoutPassword, token: token });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    const expireTime = expirationTime();

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      user: userWithoutPassword,
      token: token,
      expireTime: expireTime,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { email, password, restaurantName } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update email if provided
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Update restaurant name if provided
    if (restaurantName) {
      user.restaurantName = restaurantName;
    }

    // Handle image upload to Cloudinary if a new file is present
    if (req.file) {
      if (user.logo) {
        // If the user already has a logo, delete it from Cloudinary
        const publicId = user.logo.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`users/${publicId}`);
      }

      // Upload new logo to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: `users/${user.email}_logo`,
              folder: "users",
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

      user.logo = uploadResult.secure_url; // Update user logo URL with the new one
    }

    // Save the updated user
    await user.save();

    // Generate a new token if the user updated their email or password
    const token = generateToken(user);

    // Exclude the password before sending the response
    const { password: _, ...updatedUser } = user.toObject();

    res.status(200).json({ user: updatedUser, token });
  } catch (error) {
    console.error("Error updating user:", error.message);
    console.error(error); // Log the entire error object for more details
    res.status(500).json({ message: "Server error" });
  }
};

const findRestaurantsByname = async (req, res) => {
  const { name } = req.query;

  try {
    const restaurant = await User.find({
      restaurantName: { $regex: new RegExp(name, "i") },
    });

    if (restaurant[0].restaurantName.toLowerCase() != name) {
      return res.status(404).json({ message: "Restaurant not found" });
    } else if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    } else {
      res.status(200).json(restaurant[0]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password is incorrect" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  try {
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDesignByNumber = async (req, res) => {
  const { userId, number } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.design = number;
    await user.save();
    res.status(200).json({ message: "Design updated successfully" });
    console.log(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  findRestaurantsByname,
  updateDesignByNumber,
};
