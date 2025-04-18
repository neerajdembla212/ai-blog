import { Router, Request, Response } from "express";
import Parser from "rss-parser";
import { JSDOM } from "jsdom";
import { getCache, setCache } from "../lib/cache";
import { BlogResponse } from "./types";
import { FEED_URL, BLOG_TEXT_LIMIT } from "../config";

const router = Router();
const parser = new Parser<BlogResponse>();

const fetchMediumFeed = async (): Promise<BlogResponse[]> => {
  const feed = await parser.parseURL(FEED_URL);
  return (feed.items ?? []).map((item) => {
    const rawContent = item["content:encoded"] ?? "";
    const dom = new JSDOM(rawContent);
    const blogText = dom.window.document.body.textContent
      ? dom.window.document.body.textContent
          .split(" ")
          .slice(0, BLOG_TEXT_LIMIT)
          .join(" ")
      : "";

    return {
      title: item.title ?? '',
      link: item.link ?? '',
      pubDate: item.pubDate ?? '',
      blogText,
    } as BlogResponse;
  });
};

router.get("/", async (_req: Request, res: Response) => {
  try {
    const cachedResponse = await getCache<BlogResponse[]>(
      "medium:feed:@hoferjonathan14"
    );
    if (cachedResponse) {
      res.json({
        blogs: cachedResponse,
      });
      return;
    }

    const blogs: BlogResponse[] = await fetchMediumFeed();
    await setCache<BlogResponse[]>("medium:feed:@hoferjonathan14", blogs);

    res.json({
      blogs,
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch blogs",
    });
  }
});

export default router;
