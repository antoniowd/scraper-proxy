import puppeteer from "puppeteer";
import { SequentialRoundRobin } from "round-robin-js";

const ports = [9000, 9001, 9002, 9003, 9004, 9005, 9006, 9007, 9008, 9009];
const rb = new SequentialRoundRobin(ports);

export const request = async (url) => {
  let browser;
  try {
    const port = rb.next();
    browser = await puppeteer.launch({
      headless: true,
      args: [`--proxy-server=socks5://127.0.0.1:${port.value}`, "--no-sandbox"],
    });
    const page = await browser.newPage();

    await page.goto(url);
    const html = await page.content();
    return html;
  } catch (e) {
    console.log(e);
  } finally {
    if (browser !== undefined) {
      await browser.close();
    }
  }
};
