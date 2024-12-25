import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    res.setHeader(
      "Set-Cookie",
      "token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
    );
    return res.status(200).json({ message: "Logout successful" });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
