import Parser from "rss-parser";
import { BlogDto } from "../models/blog.dto";
import { DEFAULT_TTL, FEED_URL, MEDIUM_USERNAME } from "../config";
import { withCache } from "../lib/withCache";
import { BlogEntity } from "../models/blog.entity";
import { mapBlogEntityToBlogDto } from "../mappers/blog.mapper";
import { getCache, setCache } from "../lib/cache";
import { withTruthy } from "../lib/withTruthy";

const parser = new Parser<BlogDto>();

export const getBlogs = async (): Promise<BlogDto[]> => {
  const cacheKey = `blogs:${MEDIUM_USERNAME}`;
  const cachedBlogEntities = await getCache<BlogEntity[]>(cacheKey);
  if (cachedBlogEntities) {
    const cachedBlogDtos = cachedBlogEntities.map((b) =>
      mapBlogEntityToBlogDto(b)
    );
    return withTruthy<BlogDto>(cachedBlogDtos);
  }

  // If cache miss then fetch
  const feed: {
    items: BlogEntity[];
  } = await parser.parseURL(FEED_URL);
  const blogDtos = feed.items.map((entity) => mapBlogEntityToBlogDto(entity));
  setCache<BlogEntity[]>(cacheKey, feed.items);

  return withTruthy<BlogDto>(blogDtos);
};

export const getBlogById = async (id: string): Promise<BlogDto | undefined> => {
  const cacheKey = `blog:${id}`;
  const blog = await withCache<BlogDto | undefined>(
    cacheKey,
    DEFAULT_TTL,
    async (): Promise<BlogDto | undefined> => {
      const blogs = await getBlogs();
      return blogs?.find((blog) => blog.id === id);
    }
  );

  return blog;
};
