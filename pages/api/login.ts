import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import Joi from "joi";
import dbConnect from "../../templates/LandingPage/utils/dbConnect";
import User from "../../models/user";

const JWT_SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

const schema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "Password is required.",
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await dbConnect();
    const { email, password } = req.body;

    // Validasi input menggunakan Joi
    const { error } = schema.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Bandingkan password yang dimasukkan dengan password yang tersimpan
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Buat token JWT
    const token = await new SignJWT({ userId: user._id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(JWT_SECRET_KEY);

    // Simpan token ke cookie
    const isDevelopment = process.env.NODE_ENV === "development";
    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=3600`
    );

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
