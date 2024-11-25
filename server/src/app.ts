import express from "express";
import cors from "cors";

export const app = express();
const clientURL = "http://localhost:5173";

// app.use(express.json());

app.use(
  cors({
    origin: clientURL,
    methods: ["GET"],
  })
);

// // Basic route
// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

export default app;
