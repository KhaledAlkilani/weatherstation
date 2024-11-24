import express from "express";
import cors from "cors";
// import weatherDataRoute from "./routes/weatherDataRoute";
// import setupMQTT from "./services/mqttClient";

export const app = express();
const clientURL = "http://localhost:5173";

app.use(express.json());

app.use(
  cors({
    origin: clientURL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// app.use("/", greetingsRoute);
// app.use("/api", weatherDataRoute);

// setupMQTT();

app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;

// import express from "express";
// import cors from "cors";

// export const app = express();
// const clientURL = "http://localhost:5173";

// app.use(express.json());
// app.use(
//   cors({
//     origin: clientURL,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );

// // export default app;

// // import express from "express";

// // export const app = express();

// // Simplify app configuration since REST is not required
// export default app;
