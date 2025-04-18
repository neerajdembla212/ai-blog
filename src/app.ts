import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, ErrorRequestHandler, NextFunction } from "express";
import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import compression from "compression";
import blogRoutes from "./routes/blogs";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());

app.use("/blogs", blogRoutes);

// catch 404 and forward to error handler
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(createError(404, `Not Found: ${req.originalUrl}`));
});

// API-style Error Handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const status = (err.status as number) || 500;
  
  res.status(status).json({
    error: {
      message: err.message,
      ...(req.app.get('env') === "development" && {stack: err.stack})
    }
  });
}
app.use(errorHandler);

export default app;
