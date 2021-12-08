import express from "express";
import { simulatorRouter } from "./routes/simulator";
import { startRouter } from "./routes/start";

var app = express();

app.use("/", startRouter);
app.use("/simulator", simulatorRouter);

app.listen(8080);
console.log("Webserver started at http://localhost:8080");
