import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { db, todos } from "./db";
import { errorHandler } from "./utils";
import { eq } from "drizzle-orm";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(compression());

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

app.get(
  "/api/v1/todos/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await db
        .select()
        .from(todos)
        .where(eq(todos.id, req.params.id));
      res.status(result.length === 1 ? 200 : 404).json(result);
    } catch (error) {
      next(error);
    }
  }
);

app.post(
  "/api/v1/todos",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await db
        .insert(todos)
        .values({
          task: req.body.task,
          description: req.body.description,
          ...(req.body.dueDate && { dueDate: new Date(req.body.dueDate) }),
        })
        .returning();
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

app.patch(
  "/api/v1/todos/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const today = new Date();
      const result = await db
        .update(todos)
        .set({
          isDone: req.body.isDone,
          doneAt: today,
          updatedAt: today,
        })
        .where(eq(todos.id, req.params.id))
        .returning();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

app.delete(
  "/api/v1/todos/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await db.delete(todos).where(eq(todos.id, req.params.id));
      res.status(result.rowCount === 1 ? 200 : 404).json();
    } catch (error) {
      next(error);
    }
  }
);

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
