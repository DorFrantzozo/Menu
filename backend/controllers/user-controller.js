import User from "../model/user.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";
import { generateToken } from "../utils/jwt.js";

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
      logo: logoUrl, // Store the logo URL in the user document
    });

    // Save the user to the database
    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    // Exclude password from the user object before sending the response
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    // Send back user data and token
    res.status(201).json({ user: userWithoutPassword, token });
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

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({ user: user, token: token });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {};

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

export { createUser, loginUser, updateUser, deleteUser };

//TODO: create update user!!
