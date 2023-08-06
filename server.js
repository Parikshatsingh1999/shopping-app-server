import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { connectMongoDb } from "./dbConnection/index.js";
import { router } from "./routes/index.js";
import { logData } from "./controllers/logger.js";

dotenv.config();

const app = express();
connectMongoDb();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use(logData)

app.use("/api", router)

app.use("*", (req, res) => {
    return res.status(400).json({ error: "Path doesnt exist" });
})

app.listen(PORT, (err) => {
    console.log(`express server running on port ${PORT}`);
})