import express from "express";
import path from "path";
import fs from "fs";

const filesRouter = express.Router();

filesRouter.get("/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const exists = fs.existsSync(`./files/assets/${name}`);
        if (exists) {
            const file = path.resolve(`./files/assets/${name}`);
            res.sendFile(file)
        } else {
            throw new Error("File doesnt exists");
        }
    } catch (error) {
        res.status(404).json({ error: "file not found" });
    }
}
)


export { filesRouter }