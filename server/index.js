import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import dbConfig from "./config/db.js";
import path from "path";
import cors from "cors";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(cookieParser());
dbConfig();
const corsOptions = {
  origin: "*", // Allow only this origin
};

app.use(cors(corsOptions));
// Serve static files from the 'dist' folder
app.use(express.static(path.join(process.cwd(), "dist")));

// Serve the index.html file for any route that doesn't match a static file
// app.get("*", (req, res) => {
//   res.sendFile(path.join(process.cwd(), "dist", "index.html"));
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app.listen(PORT, () => {
  console.log("Server is running at " + PORT);
});
