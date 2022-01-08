if (process.env.NODE_ENV === "development") {
    require("dotenv").config();
}

import express from "express";
import { simulatorRouter } from "./routes/simulator";
import { socialRouter } from "./routes/social";
import swaggerUi from "swagger-ui-express";

var app = express();
const swaggerFile = process.env.SWAGGER_FILE || "./openapi_doc.json";

app.get("/", (req, res) => res.redirect(302, "./docs/"));

app.use("/simulator", simulatorRouter);
app.use("/social", socialRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(require(swaggerFile)));

app.listen(8080);

console.log(
    `API docs (swagger) is avaliable at http://localhost:8080/docs/ using specification from "${swaggerFile}"`
);
console.log("Webserver started at http://localhost:8080");
