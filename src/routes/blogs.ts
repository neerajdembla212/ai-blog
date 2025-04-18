import { Router, Request, Response } from "express";
import { withCache } from "../lib/withCache";
import { BlogResponse } from "./types";
import { fetchMediumFeed } from "../services/blogService";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const blogs = await withCache<BlogResponse[]>(
      "medium:feed:@hoferjonathan14",
      300,
      fetchMediumFeed
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

export default router;
