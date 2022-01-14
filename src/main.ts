if (process.env.NODE_ENV === "development") {
    require("dotenv").config();
}

import express from "express";
import { dashboardRouter } from "./routes/dashboard";
import { simulatorRouter } from "./routes/simulator";
import { socialRouter } from "./routes/social";
import swaggerUi from "swagger-ui-express";
import { authenticateToken } from "./middleware/auth";

import "./db/access/db";

var app = express();
const swaggerFile = process.env.SWAGGER_FILE || "./openapi_doc.json";

// Middleware
app.use(express.json());
app.use((err, req, res, next) => {
    // Check if JSON parsing error
    if (err instanceof SyntaxError && "body" in err) {
        console.error(err);
        return res.status(400).send();
    }

    next();
});

app.get("/", (req, res) => res.redirect(302, "./docs/"));

app.use("/simulator", authenticateToken, simulatorRouter);
app.use("/social", authenticateToken, socialRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(require(swaggerFile)));

app.listen(8080);

console.log(
    `API docs (swagger) is avaliable at http://localhost:8080/docs/ using specification from "${swaggerFile}"`
);
console.log("Webserver started at http://localhost:8080");
