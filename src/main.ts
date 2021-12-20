import express from "express";
import { dashboardRouter } from "./routes/dashboard";
import { simulatorRouter } from "./routes/simulator";
import { startRouter } from "./routes/start";

var app = express();

app.use("/", startRouter);
app.use("/simulator", simulatorRouter);
app.use("/dashboard", dashboardRouter);

app.listen(8080);
console.log("Webserver started at http://localhost:8080");
