import express from "express";
import { isValidId } from "../util/validators/mongodbValidator";
import { isValidDate } from "../util/validators/dateValidator";
import { escapeHtml } from "../util/html/escape";

import { Household, household as HouseholdCollection } from "../db/models/household";
import { userprofile, userprofile as UserprofileCollection } from "../db/models/userprofile";
import { objectIsEmpty } from "../util/validators/jsonValidator";

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
 *          required: ["owner", "name", "area", "location", "baseConsumption", "battery", "sellRatioOverProduction", "buyRatioUnderProduction", "windTurbines", "consumptionSpike"]
 *          properties:
 *              owner:
 *                  type: string
 *              name:
 *                  type: string
 *              thumbnail:
 *                  type: string
 *              area:
 *                  type: number
 *                  minimum: 0
 *              location:
 *                  type: object
 *                  required: ["latitude", "longitude"]
 *                  properties:
 *                      latitude:
 *                          type: number
 *                          minimum: -90
 *                          maximum: 90
 *                      longitude:
 *                          type: number
 *                          minimum: -180
 *                          maximum: 180
 *              blackout:
 *                  type: boolean
 *                  default: false
 *              baseConsumption:
 *                  type: number
 *                  minimum: 0
 *              heatingEfficiency:
 *                  type: number
 *                  maximum: 1
 *                  minimum: 0
 *                  default: 0
 *              battery:
 *                  type: object
 *                  required: ["maxCapacity"]
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
 *                  required: ["active", "maximumProduction", "cutinWindspeed", "cutoutWindspeed"]
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
 *                          minimum: 0
 *              consumptionSpike:
 *                  type: object
 *                  required: ["AmplitudeMean", "AmplitudeVariance" ,"DurationMean", "DurationVariance"]
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
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                  owner:
 *                                      type: string
 *                                  name:
 *                                      type: string
 *          500:
 *              description: Internal server error
 */
simulatorRouter.get("/grid/blackouts", async (req, res) => {
    const query = { blackout: true };
    const fields = "_id name owner";

    let blackouts;
    try {
        blackouts = await HouseholdCollection.find(query, fields).exec();
    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }

    return res.status(200).send(blackouts);
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
 */
simulatorRouter.get("/grid/summary", (req, res) => {
    res.status(501).send();
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
 *              description: A list of all household that belongs to the specified user. <br/><br/> If the user does not own any households, the response will be an empty array.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              allOf:
 *                                  - type: object
 *                                    required: ["_id"]
 *                                    properties:
 *                                        _id:
 *                                            type: string
 *                                  - $ref: "#/components/schemas/Household"
 *          400:
 *              description: Invalid user id
 *          403:
 *              description: The requester does not have sufficient permissions.
 *          500:
 *              description: Internal server error
 *
 */
simulatorRouter.get("/households/u/:id", async (req, res) => {
    const userid = req.params.id;
    if (isValidId(userid) === false) return res.status(400).send();

    let households;
    try {
        households = await HouseholdCollection.find({ owner: userid }).exec();
    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }

    return res.status(200).send(households);
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
 *                  application/json:
 *                      schema:
 *                          allOf:
 *                              - type: object
 *                                required: ["_id"]
 *                                properties:
 *                                    _id:
 *                                        type: string
 *                              - $ref: "#/components/schemas/Household"
 *          400:
 *              description: Bad request, see response body for more details. <br/><br/>The response contains a list of errors.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: string
 *          500:
 *              description: Internal server error
 *
 */
simulatorRouter.post("/household/", async (req, res) => {
    const household = req.body;
    if (objectIsEmpty(household)) return res.status(400).send(["Empty request body, no household found"]);

    if (household.hasOwnProperty("_id")) delete household._id; // Prevent user to set document id
    const householdDocument = new HouseholdCollection(household);

    try {
        await householdDocument.save();
        return res.status(201).send(householdDocument);
    } catch (error) {
        if (error.name === "ValidationError") {
            let errorMessages = [];
            for (const err in error.errors) {
                errorMessages.push(error.errors[err].message);
            }

            return res.status(400).send(errorMessages);
        } else return res.status(500).send();
    }
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
 *                          allOf:
 *                              - type: object
 *                                required: ["_id"]
 *                                properties:
 *                                    _id:
 *                                        type: string
 *                              - $ref: "#/components/schemas/Household"
 *          400:
 *              description: Invalid household id
 *          403:
 *              description: The requester does not have sufficient permissions.
 *          404:
 *              description: The household could not be found.
 *          500:
 *              description: Internal server error
 *
 */
simulatorRouter.get("/household/:id", async (req, res) => {
    const householdId = req.params.id;
    if (isValidId(householdId) === false) return res.status(400).send();

    let household;
    try {
        household = await HouseholdCollection.findById(householdId).exec();
    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }

    if (household === null) return res.status(404).send();
    else return res.status(200).send(household);
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
 *          description: Information about household to update. <br/><br/>Note&#58; Only the properties that should be changed are required, other properties can be skipped.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Household"
 *      responses:
 *          200:
 *              description: Household was successfully updated.
 *          400:
 *              description: Bad request, see response body for more details. <br/><br/>The response contains a list of errors.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: string
 *          403:
 *              description: The requester does not have sufficient permissions.
 *          404:
 *              description: The household could not be found.
 *          500:
 *              description: Internal server error
 *
 *
 */
simulatorRouter.put("/household/:id", async (req, res) => {
    const changes = req.body;
    const householdId = req.params.id;

    if (!isValidId(householdId)) return res.status(400).send(["Invalid household id"]);
    if (objectIsEmpty(changes)) return res.status(400).send(["Empty request body, no changes found"]);

    let householdDoc;
    try {
        householdDoc = await HouseholdCollection.findById(householdId).exec();
    } catch (err) {
        if (err.name === "DocumentNotFoundError") return res.status(404).send();
        else return res.status(500).send();
    }

    householdDoc.set(changes);

    try {
        await householdDoc.save();
        return res.status(200).send();
    } catch (error) {
        if (error.name === "DocumentNotFoundError") return res.status(404).send();
        if (error.name === "ValidationError") {
            let errorMessages = [];
            for (const err in error.errors) {
                errorMessages.push(error.errors[err].message);
            }

            return res.status(400).send(errorMessages);
        } else return res.status(500).send();
    }
});

/**
 * @openapi
 * /simulator/household/{id}:
 *  delete:
 *      tags:
 *          - Simulator
 *      description: Delete a household
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of household
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          204:
 *              description: Household was successfully deleted.
 *          400:
 *              description: Invalid household id.
 *          403:
 *              description: The requester does not have sufficient permissions.
 *          404:
 *              description: The household could not be found.
 *
 *
 */
simulatorRouter.delete("/household/:id", async (req, res) => {
    const householdId = req.params.id;

    if (!isValidId(householdId)) return res.status(400).send();

    try {
        const household = await HouseholdCollection.findById(householdId).remove().exec();
        if (household.deletedCount === 0) return res.status(404).send();
    } catch (err) {
        return res.status(500).send();
    }
    return res.status(204).send();
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
