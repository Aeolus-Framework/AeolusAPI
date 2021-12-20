import express from "express";

export const dashboardRouter = express.Router();

dashboardRouter.get("/", (req, res) => {
    res.send("You have navigated to the dashboard API");
});

dashboardRouter.get("/:userid", (req, res) => {
    res.send("This is your dashboard...");
});

dashboardRouter.post("/:userid/", (req, res) => {
    res.send(req.body);
});
