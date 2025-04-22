import { Router, Request, Response } from "express";
import { getBlogs, getBlogById } from "../services/blogService";
import { summarizeText } from "../services/openAIService";
import { BlogDto } from "../models/blog.dto";
import { fineTuneLogger, TRAINING_LOG_PATH } from "../lib/fineTuneLogger";
import { uploadTrainingData } from "../lib/s3";

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
      void (async () => {
        if (process.env.LOG_SUMMARY_TRAINING === "true") {
          try {
            fineTuneLogger(blog.content, summary);
            await uploadTrainingData(TRAINING_LOG_PATH);
          } catch (err) {
            console.log("Async upload training data failed: ", err);
          }
        }
      })();

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
