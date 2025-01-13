import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import dbConfig from "./config/db.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
dbConfig();
app.use(express.json());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log("Server is running at " + PORT);
});
