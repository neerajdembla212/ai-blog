import { Router, Request, Response } from "express";
import Parser from "rss-parser";
import { JSDOM } from "jsdom";
import { BlogResponse } from "./types";

const router = Router();
const parser = new Parser<BlogResponse>();
const FEED_URL = "https://medium.com/feed/@hoferjonathan14";

router.get("/", async (req: Request, res: Response) => {
  try {
    const feed = await parser.parseURL(FEED_URL);
    const blogs = feed.items?.map((item) => {
      const rawContent = item["content:encoded"] ?? "";
      const dom = new JSDOM(rawContent);
      const blogText = dom.window.document.body.textContent ?? "";

      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        blogText,
      };
    });
    res.json({
      blogs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch blogs",
    });
  }
});

export default router;
