import express from "express";
import { isValidDate } from "../util/date/validator";
import { escapeHtml } from "../util/html/escape";

export const simulatorRouter = express.Router();

simulatorRouter.get("/", (req, res) => {
    res.send("You have navigated to the simulator API");
});

simulatorRouter.get("/household/:id", (req, res) => {
    res.send(`You have requested information about household ${req.params.id}`);
});

simulatorRouter.get("/household/:id/consumption/:from/:to?", (req, res) => {
    const dateFrom = new Date(req.params.from);
    const dateTo = req.params.to ? new Date(req.params.to) : new Date();
    if (!isValidDate(dateFrom) || !isValidDate(dateTo)) {
        res.status(400);
        res.send("Invalid date");
    }
    res.send(
        `You have requested information about household ${escapeHtml(
            req.params.id
        )} from ${dateFrom.toLocaleDateString()} to ${dateTo.toLocaleDateString()}`
    );
});
