import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRES_IN || "7d" }
    );

    res.json({
      status: 200,
      message: "Login successfully",
      token,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ message: "Server Error" });
  }
};

export const SignUp = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ message: "user already exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRES_IN || "7d" }
    );

    res.json({
      status: 200,
      message: "user registered successfully",
      data: user[0],
      token,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ message: "Server Error" });
  }
};

export const ResetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // 1. Check required fields
    if (!email || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({
          message: "Email, new password, and confirm password are required",
        });
    }

    // 2. Check passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 3. Validate minimum password length
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // 4. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 5. Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 6. Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const GetProfile = async (req, res) => {
  try {
    // req.user comes from JWT middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    // Find user by ID
    const user = await User.findById(userId).select("-password");
    // remove password from response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const RefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // 1. Check for refresh token
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // 2. Verify refresh token
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Invalid or expired refresh token" });
        }

        const userId = decoded.id;

        // Optional: verify user existence
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // 3. Create new access token
        const newAccessToken = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // 4. Optional: also create new refresh token
        const newRefreshToken = jwt.sign(
          { id: user._id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "7d" }
        );

        res.status(200).json({
          message: "Token refreshed successfully",
          accessToken: newAccessToken,
          refreshToken: newRefreshToken, // optional, but recommended
        });
      }
    );
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const Logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    // Remove refresh token from DB
    await Token.deleteOne({ token: refreshToken });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
