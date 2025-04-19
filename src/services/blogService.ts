import Parser from "rss-parser";
import { JSDOM } from "jsdom";
import { BlogResponse } from "../routes/types";
import { BLOG_TEXT_LIMIT, FEED_URL } from "../config";
import { generateId } from "../lib/hash";
import { withCache } from "../lib/withCache";

const parser = new Parser<BlogResponse>();

export const getBlogs = async (): Promise<BlogResponse[]> => {
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
      id: item.link ? generateId(item.link) : item.guid ?? "",
      title: item.title ?? "",
      link: item.link ?? "",
      pubDate: item.pubDate ?? "",
      blogText,
    } as BlogResponse;
  });
};

export const getBlogById = async (
  id: string
): Promise<BlogResponse | undefined> => {
  const blog = await withCache<BlogResponse | undefined>(
    `blog:${id}`,
    300,
    async (): Promise<BlogResponse | undefined> => {
      const blogs = await withCache<BlogResponse[]>(
        "medium:feed:@hoferjonathan14",
        300,
        getBlogs
      );
      const blogToSummarize = blogs?.find((blog) => blog.id === id);
      if (blogToSummarize) {
        return blogToSummarize;
      }
    }
  );

  return blog;
};
