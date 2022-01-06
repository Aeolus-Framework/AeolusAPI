import express from "express";
import { isValidDate } from "../util/date/validator";
import { escapeHtml } from "../util/html/escape";

export const simulatorRouter = express.Router();

function respondWithReqUrl(req: any): string {
    return `You have navigated to <a href="${req.originalUrl}">${req.originalUrl}</a>`;
}

simulatorRouter.get("/grid/blackouts", (req, res) => {
    /* 	
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint to list all blackouts' 
        #swagger.responses[200] = {
            description: "Ok response",
            schema: {
                foo: "bar"
            }
        } 
    */

    res.send(respondWithReqUrl(req));
});

simulatorRouter.get("/grid/summary", (req, res) => {
    /* 	#swagger.tags = ['Simulator']
        #swagger.description = 'Endpoint to list all blackouts' */

    res.send(respondWithReqUrl(req));
});

simulatorRouter.get("/household/u/:id", (req, res) => {
    /* 	#swagger.tags = ['Simulator']
        #swagger.description = 'Endpoint to list all blackouts' */
    res.send(respondWithReqUrl(req));
});

simulatorRouter.get("/household/:id", (req, res) => {
    /* 	#swagger.tags = ['Simulator']
        #swagger.description = 'Endpoint to fetch data about a household' 
        #swagger.responses[200] = {
            schema: { "$ref": "#/definitions/Household" },
            description: "Household was found"
        }
        */
    res.status(200).json({
        data: {},
        message: "OK"
    });
    //res.send(respondWithReqUrl(req));
});

simulatorRouter.get("/:id/battery/:from/:to?", (req, res) => {
    /* 	#swagger.tags = ['Simulator']
        #swagger.description = 'Endpoint to list all blackouts' */

    const dateFrom = new Date(req.params.from);
    const dateTo = req.params.to ? new Date(req.params.to) : new Date();
    if (!isValidDate(dateFrom) || !isValidDate(dateTo)) {
        res.status(400);
        res.send("Invalid date");
    }
    res.send(
        `You have requested battery of household ${escapeHtml(
            req.params.id
        )} from ${dateFrom.toLocaleDateString()} to ${dateTo.toLocaleDateString()}`
    );
});

simulatorRouter.get("/:id/production/:from/:to?", (req, res) => {
    /* 	#swagger.tags = ['Simulator']
        #swagger.description = 'Endpoint to list all blackouts' */

    const dateFrom = new Date(req.params.from);
    const dateTo = req.params.to ? new Date(req.params.to) : new Date();
    if (!isValidDate(dateFrom) || !isValidDate(dateTo)) {
        res.status(400);
        res.send("Invalid date");
    }
    res.send(
        `You have requested production of household ${escapeHtml(
            req.params.id
        )} from ${dateFrom.toLocaleDateString()} to ${dateTo.toLocaleDateString()}`
    );
});

simulatorRouter.get("/:id/consumption/:from/:to?", (req, res) => {
    /* 	#swagger.tags = ['Simulator']
        #swagger.description = 'Endpoint to list all blackouts' */
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
