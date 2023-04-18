import dotenv from "dotenv";
import express from "express";
import { request } from "./libs/scraper.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  const { url } = req.body;
  const html = await request(url);
  res.json({ html });
});

app.listen(process.env.PORT || 8000);
