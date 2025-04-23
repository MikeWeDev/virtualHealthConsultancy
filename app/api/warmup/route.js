// /pages/api/warmup.js
import dbConnect from '../../../lib/db'; // We'll create this below

export default async function handler(req, res) {
  await dbConnect(); // Connects on first hit
  res.status(200).json({ message: "DB Warmed up" });
}
