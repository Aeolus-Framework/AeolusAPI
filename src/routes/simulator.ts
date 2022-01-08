import express from "express";
import { isValidDate } from "../util/date/validator";
import { escapeHtml } from "../util/html/escape";

export const simulatorRouter = express.Router();

function respondWithReqUrl(req: any): string {
    return `You have navigated to <a href="${req.originalUrl}">${req.originalUrl}</a>`;
}

/**
 * @openapi
 * components:
 *  schemas:
 *      Household:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *              owner:
 *                  type: string
 *              dashboard:
 *                  type: array
 *                  items:
 *                      type: number
 *              thumbnail:
 *                  type: string
 *              area:
 *                  type: number
 *                  minimum: 0
 *              location:
 *                  type: object
 *                  properties:
 *                      latitude:
 *                          type: number
 *                      longitude:
 *                          type: number
 *              blackout:
 *                  type: boolean
 *              baseConsumption:
 *                  type: number
 *                  minimum: 0
 *              heatingEfficiency:
 *                  type: number
 *                  maximum: 1
 *                  minimum: 0
 *              battery:
 *                  type: object
 *                  properties:
 *                      maxCapacity:
 *                          type: number
 *                          minimum: 0
 *              sellRatioOverProduction:
 *                  type: number
 *              buyRatioUnderProduction:
 *                  type: number
 *              windTurbines:
 *                  type: object
 *                  properties:
 *                      active:
 *                          type: number
 *                          minimum: 0
 *                      maximumProduction:
 *                          type: number
 *                      cutinWindspeed:
 *                          type: number
 *                          minimum: 0
 *                      cutoutWindspeed:
 *                          type: number
 *              consumptionSpike:
 *                  type: object
 *                  properties:
 *                      AmplitudeMean:
 *                          type: number
 *                      AmplitudeVariance:
 *                          type: number
 *                      DurationMean:
 *                          type: number
 *                      DurationVariance:
 *                          type: number
 *
 *      Battery:
 *          type: object
 *          properties:
 *              timestamp:
 *                  type: string
 *                  format: date-time
 *              household:
 *                  type: string
 *              energy:
 *                  type: number
 *                  minimum: 0
 *
 *
 *      Consumption:
 *          type: object
 *          properties:
 *              timestamp:
 *                  type: string
 *                  format: date-time
 *              household:
 *                  type: string
 *              consumption:
 *                  type: number
 *                  minimum: 0
 *
 *      Production:
 *          type: object
 *          properties:
 *              timestamp:
 *                  type: string
 *                  format: date-time
 *              household:
 *                  type: string
 *              production:
 *                  type: number
 *                  minimum: 0
 *
 *      Transmission:
 *          type: object
 *          properties:
 *              timestamp:
 *                  type: string
 *                  format: date-time
 *              household:
 *                  type: string
 *              amount:
 *                  type: number
 *                  minimum: 0
 *
 *      Windspeed:
 *          type: object
 *          properties:
 *              timestamp:
 *                  type: string
 *                  format: date-time
 *              windspeed:
 *                  type: number
 *                  minimum: 0
 *
 */

/**
 * @openapi
 * /simulator/grid/blackouts:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get all current blackout in grid.
 *      responses:
 *          200:
 *              description: Return something
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Household'
 */
simulatorRouter.get("/grid/blackouts", (req, res) => {
    res.send(respondWithReqUrl(req));
});

simulatorRouter.get("/grid/summary", (req, res) => {
    res.send(respondWithReqUrl(req));
});

simulatorRouter.get("/household/u/:id", (req, res) => {
    res.send(respondWithReqUrl(req));
});

simulatorRouter.get("/household/:id", (req, res) => {
    res.status(200).json({
        data: {},
        message: "OK"
    });
});

simulatorRouter.get("/:id/battery/:from/:to?", (req, res) => {
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
