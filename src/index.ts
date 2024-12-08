import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { db, todos } from "./db";
import { errorHandler } from "./utils";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/healthcheck", (req: Request, res: Response) => {
  try {
    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send();
  }
});

app.get(
  "/api/v1/todos",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await db.select().from(todos);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

app.get("/api/v1/todos/:id", (req: Request, res: Response) => {
  res.send("GET TODO BY ID");
});

app.post("/api/v1/todos", (req: Request, res: Response) => {
  res.send("POST CREATE TODO");
});

app.patch("/api/v1/todos/:id", (req: Request, res: Response) => {
  res.send("UPDATE TODO BY ID");
});

app.delete("/api/v1/todos/:id", (req: Request, res: Response) => {
  res.send("DELETE TODO BY ID");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandler.handle(err, res);
});

const server = createServer(app);
const port = process.env.PORT ?? 8080;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error({ promise, reason });
});

process.on("uncaughtException", (error) => {
  console.error({ error }, "Uncaught Exception");

  server.close(() => {
    console.info("Server closed");
    process.exit(1);
  });

  setTimeout(() => process.exit(1), 10000).unref();
});
