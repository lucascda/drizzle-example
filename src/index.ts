import express from "express";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const port = 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
