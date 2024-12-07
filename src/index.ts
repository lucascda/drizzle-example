import express, { Request, Response } from "express";
import { createServer } from "http";

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

app.get("/api/v1/todos", (req: Request, res: Response) => {
  res.send("GET TODOS");
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
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
