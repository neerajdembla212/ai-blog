import Parser from "rss-parser";
import { JSDOM } from "jsdom";
import { BlogResponse } from "../routes/types";
import { BLOG_TEXT_LIMIT, FEED_URL } from "../config";

const parser = new Parser<BlogResponse>();

export const fetchMediumFeed = async (): Promise<BlogResponse[]> => {
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
        title: item.title ?? "",
        link: item.link ?? "",
        pubDate: item.pubDate ?? "",
        blogText,
      } as BlogResponse;
    });
  };