import express, { Request, Response } from "express";
import { createServer } from "http";
import "dotenv/config";
import { db, todos } from "./db";

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

app.get("/api/v1/todos", async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(todos);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

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

const server = createServer(app);
const port = process.env.PORT ?? 8080;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
