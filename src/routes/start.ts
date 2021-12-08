import express from "express";

export const startRouter = express.Router();

startRouter.get("/", (req, res) => {
    res.write("<h1>Endpoints</h1>");
    res.write("<pre><a href='./simulator'>/simulator</a></pre>");
    res.send();
});
