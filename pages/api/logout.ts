import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const isProduction = process.env.NODE_ENV === "production";

    res.setHeader(
      "Set-Cookie",
      `token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; ${
        isProduction ? "Secure;" : ""
      }`
    );

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

    return res.status(200).json({ message: "Logout successful" });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
