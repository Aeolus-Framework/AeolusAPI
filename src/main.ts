if (process.env.NODE_ENV === "development") {
    require("dotenv").config();
}

import express from "express";
import { dashboardRouter } from "./routes/dashboard";
import { simulatorRouter } from "./routes/simulator";
import { startRouter } from "./routes/start";
import swaggerUi from "swagger-ui-express";

var app = express();
const swaggerFile = process.env.SWAGGER_FILE;

app.use("/", startRouter);
app.use("/simulator", simulatorRouter);
app.use("/dashboard", dashboardRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(require(swaggerFile)));

app.listen(8080);

console.log(
    `API docs (swagger) is avaliable at http://localhost:8080/docs/ using specification from "${swaggerFile}"`
);
console.log("Webserver started at http://localhost:8080");
