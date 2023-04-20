import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";

dotenv.config();
const torProxyAgent = new SocksProxyAgent("socks://127.0.0.1:9150");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ip", async (_, res) => {
  const response = await axios({
    url: "https://ipecho.net/plain",
    method: "GET",
    httpsAgent: torProxyAgent,
    httpAgent: torProxyAgent,
  });
  res.json(response.data);
});

app.listen(process.env.PORT || 8000, () => {
  console.log("listening");
});
