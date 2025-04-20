import { BLOG_TEXT_LIMIT } from "../config";
import { generateId } from "../lib/hash";
import { BlogDto } from "../models/blog.dto";
import { BlogEntity } from "../models/blog.entity";

const isBlogEntity = (obj: unknown): obj is BlogEntity => {
  const requiredKeys = [
    "guid",
    "content:encodedSnippet",
    "pubDate",
    "title",
    "link",
  ];
  return requiredKeys.every((key) =>
    Object.prototype.hasOwnProperty.call(obj, key)
  );
};
export const mapBlogEntityToBlogDto = (
  blog: BlogEntity
): BlogDto | undefined => {
  if (!isBlogEntity(blog)) {
    return;
  }
  return {
    id: (blog.link ? generateId(blog.link) : blog.guid) ?? "",
    title: blog.title ?? "",
    link: blog.link ?? "",
    pubDate: blog.pubDate ?? "",
    content: blog["content:encodedSnippet"] ?? "",
  };
};
