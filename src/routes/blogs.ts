import { Router, Request, Response } from "express";
import { withCache } from "../lib/withCache";
import { BlogResponse } from "./types";
import { getBlogs, getBlogById } from "../services/blogService";
import { summarizeText } from "../services/openAIService";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const blogs = await withCache<BlogResponse[]>(
      "medium:feed:@hoferjonathan14",
      300,
      getBlogs
    );

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

router.get("/:id/summary", async (req: Request, res: Response) => {
  try {
    const blogId = req.params?.id;
    if (!blogId) {
      return;
    }
    const blog = await getBlogById(blogId);
    if (blog) {
      const blogSummary = await summarizeText(blogId, blog.blogText);

      res.json({
        blog: {
          ...blog,
          blogSummary,
        },
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
