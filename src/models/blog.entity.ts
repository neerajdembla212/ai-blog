import Parser from "rss-parser";

export interface BlogEntity {
  guid?: string;
  content?: string;
  contentSnippet?: string;
  enclosure?: Parser.Enclosure;
  isoDate?: string;
  title?: string;
  link?: string;
  pubDate?: string;
  ["content:encoded"]?: string;
  ["content:encodedSnippet"]?: string;
  creator?: string;
  categories?: string[];
  summary?: string;
}
