import { Router, Request, Response } from "express";
import { withCache } from "../lib/withCache";
import { getBlogs, getBlogById } from "../services/blogService";
import { summarizeText } from "../services/openAIService";
import { BlogDto } from "../models/blog.dto";
import { mapBlogEntityToBlogDto } from "../mappers/blog.mapper";
import { DEFAULT_TTL, MEDIUM_USERNAME } from "../config";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const blogs = await getBlogs();

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

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const blogId = req.params?.id;
    if (!blogId) {
      return;
    }
    const blog = await getBlogById(blogId);
    res.json({
      blog,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch blog",
    });
  }
});

router.get("/:id/summary", async (req: Request, res: Response) => {
  try {
    const blogId = req.params?.id;
    if (!blogId) {
      return;
    }
    const blog = await getBlogById(blogId);
    if (blog) {
      const summary = await summarizeText(blogId, blog.content);
      const response: BlogDto = {
        ...blog,
        summary,
      };
      res.json({
        blog: response,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to summarize blog",
    });
  }
});

export default router;
