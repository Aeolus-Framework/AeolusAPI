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
 *              owner:
 *                  type: string
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
 *      MarketPrice:
 *          type: object
 *          properties:
 *              timestamp:
 *                  type: string
 *                  format: date-time
 *              price:
 *                  type: number
 *                  example: 2.31
 *              currency:
 *                  type: string
 *                  example: euro
 *      Powerplant:
 *          type: object
 *          properties:
 *              enabled:
 *                  type: boolean
 *              status:
 *                  type: string
 *              production:
 *                  type: number
 *              consumption:
 *                  type: number
 *
 */

/**
 * @openapi
 * /simulator/grid/blackouts:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get all current blackouts in the grid.
 *      responses:
 *          200:
 *              description: Returns a list of households with an ongoing blackout.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: string
 */
simulatorRouter.get("/grid/blackouts", (req, res) => {
    res.send(respondWithReqUrl(req));
});

/**
 * @openapi
 * /simulator/grid/summary:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Work in progress.
 *      responses:
 *          501:
 *              description: Not implemented
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 */
simulatorRouter.get("/grid/summary", (req, res) => {
    res.status(200).send("501, not implemented");
});

/**
 * @openapi
 * /simulator/households/u/{id}:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get all households that belongs to a specific user.
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of user in which to get all households from.
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Household"
 *          403:
 *              description: The requester does not have sufficient permissions.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          404:
 *              description: The user could not be found.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *
 */
simulatorRouter.get("/households/u/:id", (req, res) => {
    res.send(respondWithReqUrl(req));
});

/**
 * @openapi
 * /simulator/household:
 *  post:
 *      tags:
 *          - Simulator
 *      description: Create a new household with the requester as owner
 *      requestBody:
 *          description: Information about household to create
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Household"
 *      responses:
 *          201:
 *              description: Household was successfully created.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *
 */
simulatorRouter.post("/household/", (req, res) => {
    res.send(respondWithReqUrl(req));
});

/**
 * @openapi
 * /simulator/household/{id}:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get household by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of household
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Household"
 *          403:
 *              description: The requester does not have sufficient permissions.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          404:
 *              description: The household could not be found or the requester does not have sufficient permissions.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *
 */
simulatorRouter.get("/household/:id", (req, res) => {
    res.status(200).json({
        data: {},
        message: "OK"
    });
});

/**
 * @openapi
 * /simulator/household/{id}:
 *  put:
 *      tags:
 *          - Simulator
 *      description: Update an existing household
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of household
 *            required: true
 *            schema:
 *                type: string
 *      requestBody:
 *          description: Information about household to update
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Household"
 *      responses:
 *          200:
 *              description: Household was successfully created.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          400:
 *              description: Bad request, see response body for more details.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          403:
 *              description: The requester does not have sufficient permissions.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          404:
 *              description: The household could not be found.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *
 *
 */
simulatorRouter.put("/household/:id", (req, res) => {
    res.send(respondWithReqUrl(req));
});

/**
 * @openapi
 * /simulator/household/{id}:
 *  delete:
 *      tags:
 *          - Simulator
 *      description: Update an existing household
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of household
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: Household was successfully created.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          400:
 *              description: Bad request, see response body for more details.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          403:
 *              description: The requester does not have sufficient permissions.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          404:
 *              description: The household could not be found.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *
 *
 */
simulatorRouter.delete("/household/:id", (req, res) => {
    res.send(respondWithReqUrl(req));
});

/**
 * @openapi
 * /simulator/household/{id}/battery/{from}/{to}:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get battery history from a household between two dates
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of household
 *            required: true
 *            schema:
 *                type: string
 *          - name: from
 *            in: path
 *            description: date or datetime to get battery history from. Value can also be number of milliseconds since Jan 1, 1970, 00:00:00.000 GMT.
 *            required: true
 *            schema:
 *                type: string
 *                format: date-time
 *          - name: to
 *            in: path
 *            description: date or datetime to get battery history to. Value can also be number of milliseconds since Jan 1, 1970, 00:00:00.000 GMT. If empty, the value will be time now.
 *            required: true
 *            schema:
 *                type: string
 *                format: date-time
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Battery"
 *          400:
 *              description: Bad request, see response body for more details.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          403:
 *              description: The requester does not have sufficient permissions.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          404:
 *              description: The household could not be found.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *
 */
simulatorRouter.get("/household/:id/battery/:from/:to?", (req, res) => {
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

/**
 * @openapi
 * /simulator/household/{id}/production/{from}/{to}:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get production history from a household between two dates
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of household
 *            required: true
 *            schema:
 *                type: string
 *          - name: from
 *            in: path
 *            description: date or datetime to get production history from. Value can also be number of milliseconds since Jan 1, 1970, 00:00:00.000 GMT.
 *            required: true
 *            schema:
 *                type: string
 *                format: date-time
 *          - name: to
 *            in: path
 *            description: date or datetime to get production history to. Value can also be number of milliseconds since Jan 1, 1970, 00:00:00.000 GMT. If empty, the value will be time now.
 *            required: true
 *            schema:
 *                type: string
 *                format: date-time
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Production"
 *          400:
 *              description: Bad request, see response body for more details.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          403:
 *              description: The requester does not have sufficient permissions.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          404:
 *              description: The household could not be found.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *
 */
simulatorRouter.get("/household/:id/production/:from/:to?", (req, res) => {
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

/**
 * @openapi
 * /simulator/household/{id}/consumption/{from}/{to}:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get consumption history from a household between two dates
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of household
 *            required: true
 *            schema:
 *                type: string
 *          - name: from
 *            in: path
 *            description: date or datetime to get consumption history from. Value can also be number of milliseconds since Jan 1, 1970, 00:00:00.000 GMT.
 *            required: true
 *            schema:
 *                type: string
 *                format: date-time
 *          - name: to
 *            in: path
 *            description: date or datetime to get consumption history to. Value can also be number of milliseconds since Jan 1, 1970, 00:00:00.000 GMT. If empty, the value will be time now.
 *            required: true
 *            schema:
 *                type: string
 *                format: date-time
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Consumption"
 *          400:
 *              description: Bad request, see response body for more details.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          403:
 *              description: The requester does not have sufficient permissions.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          404:
 *              description: The household could not be found.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *
 */
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

/**
 * @openapi
 * /simulator/household/{id}/transmission/{from}/{to}:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get transmission history from a household between two dates
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of household
 *            required: true
 *            schema:
 *                type: string
 *          - name: from
 *            in: path
 *            description: date or datetime to get transmission history from. Value can also be number of milliseconds since Jan 1, 1970, 00:00:00.000 GMT.
 *            required: true
 *            schema:
 *                type: string
 *                format: date-time
 *          - name: to
 *            in: path
 *            description: date or datetime to get transmission history to. Value can also be number of milliseconds since Jan 1, 1970, 00:00:00.000 GMT. If empty, the value will be time now.
 *            required: true
 *            schema:
 *                type: string
 *                format: date-time
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Transmission"
 *          400:
 *              description: Bad request, see response body for more details.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          403:
 *              description: The requester does not have sufficient permissions.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          404:
 *              description: The household could not be found.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *
 */
simulatorRouter.get("/household/:id/transmission/:from/:to?", (req, res) => {
    const dateFrom = new Date(req.params.from);
    const dateTo = req.params.to ? new Date(req.params.to) : new Date();
    if (!isValidDate(dateFrom) || !isValidDate(dateTo)) {
        res.status(400).send("Invalid date");
    }
    res.send(
        `You have requested information about household ${escapeHtml(
            req.params.id
        )} from ${dateFrom.toLocaleDateString()} to ${dateTo.toLocaleDateString()}`
    );
});

/**
 * @openapi
 * /simulator/windspeed/{from}/{to}:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get windspeed history between two dates
 *      parameters:
 *          - name: from
 *            in: path
 *            description: date or datetime to get windspeed history from. Value can also be number of milliseconds since Jan 1, 1970, 00:00:00.000 GMT.
 *            required: true
 *            schema:
 *                type: string
 *                format: date-time
 *          - name: to
 *            in: path
 *            description: date or datetime to get windspeed history to. Value can also be number of milliseconds since Jan 1, 1970, 00:00:00.000 GMT. If empty, the value will be time now.
 *            required: true
 *            schema:
 *                type: string
 *                format: date-time
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Windspeed"
 *          400:
 *              description: Bad request, see response body for more details.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *
 */
simulatorRouter.get("/windspeed/:from/:to?", (req, res) => {
    const dateFrom = new Date(req.params.from);
    const dateTo = req.params.to ? new Date(req.params.to) : new Date();
    if (!isValidDate(dateFrom) || !isValidDate(dateTo)) {
        res.status(400).send("Invalid date");
    }
    res.send(
        `You have requested windspeed history from ${dateFrom.toLocaleDateString()} to ${dateTo.toLocaleDateString()}`
    );
});

/**
 * @openapi
 * /simulator/market/price:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get latest electricity price in price per kilowatt hour (kWh)
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/MarketPrice"
 */
simulatorRouter.get("/market/price", (req, res) => {
    res.send(respondWithReqUrl(req));
});

/**
 * @openapi
 * /simulator/market/block/{id}/{duration}:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Block a household to sell electricity in a period of time.
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of household
 *            required: true
 *            schema:
 *                type: string
 *          - name: duration
 *            in: path
 *            description: number of minutes to block the specified household
 *            required: true
 *            schema:
 *                type: number
 *                minimum: 0
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          400:
 *              description: Bad request, see response body for more details.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          403:
 *              description: The requester does not have sufficient permissions.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 */
simulatorRouter.get("/market/block/:id/:duration", (req, res) => {
    res.send(
        `You've blocked household ${escapeHtml(req.params.id)} to sell electricity for ${escapeHtml(
            req.params.duration
        )} minute(s).`
    );
});

/**
 * @openapi
 * /simulator/powerplant/status:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get status of powerplant.
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Powerplant"
 *          400:
 *              description: Bad request, see response body for more details.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          403:
 *              description: The requester does not have sufficient permissions.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 */
simulatorRouter.get("/powerplant/status", (req, res) => {
    res.send(respondWithReqUrl(req));
});

/**
 * @openapi
 * /simulator/powerplant/status:
 *  put:
 *      tags:
 *          - Simulator
 *      description: Set status of powerplant.
 *      requestBody:
 *          description: status to set
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          enabled:
 *                              type: boolean
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          400:
 *              description: Bad request, see response body for more details.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          403:
 *              description: The requester does not have sufficient permissions.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 */
simulatorRouter.put("/powerplant/status", (req, res) => {
    res.send(respondWithReqUrl(req));
});
