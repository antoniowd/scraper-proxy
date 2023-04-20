import puppeteer from "puppeteer";
import { SequentialRoundRobin } from "round-robin-js";
import { range } from "./util.js";

const ports = new SequentialRoundRobin(range(9150, 9150));

export const request = async (url) => {
  let browser;
  const port = ports.next();
  console.log(port);
  try {
    browser = await puppeteer.launch({
      executablePath: "/usr/bin/google-chrome",
      headless: true,
      args: [`--proxy-server=socks5://127.0.0.1:${port.value}`, "--no-sandbox"],
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(1000 * 60 * 5); // 5 minutes
    await page.setRequestInterception(true);

    page.on("request", (req) => {
      if (req.resourceType() === "image" || req.resourceType() === "font") {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url);
    const html = await page.content();
    await browser.close();
    return { html, success: true };
  } catch (e) {
    console.error(e);
    if (browser !== undefined) {
      await browser.close();
    }
    return { success: false, error: e.message };
  }
};
