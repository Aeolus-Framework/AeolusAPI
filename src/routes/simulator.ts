import express from "express";
import flattenObject from "../util/object/flatten";
import { isValidId } from "../util/validators/mongodbValidator";
import { objectIsEmpty } from "../util/validators/jsonValidator";
import { isValidDate } from "../util/validators/dateValidator";

import { household as HouseholdCollection } from "../db/models/household";
import { batteryHistory as BatteryHistoryCollection } from "../db/models/battery";
import { production as ProductionHistoryCollection } from "../db/models/production";
import { consumption as ConsumptionHistoryCollection } from "../db/models/consumption";
import { transmission as TransmissionHistoryCollection } from "../db/models/transmission";
import { getLatestWindspeed, windspeed as WindspeedCollection } from "../db/models/windspeed";
import { powerplant as PowerplantCollection } from "../db/models/powerplant";
import { market as MarketCollection } from "../db/models/market";
import { authorize, Roles } from "../middleware/auth";
import { userIsAdmin, userIsAdminOrHouseholdOwner } from "../util/routeHelpers";

export const simulatorRouter = express.Router();

enum historyParameter {
    battery = "battery",
    production = "production",
    consumption = "consumption",
    transmission = "transmission"
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
 *                  maximum: 1
 *                  minimum: 0
 *              buyRatioUnderProduction:
 *                  type: number
 *                  maximum: 1
 *                  minimum: 0
 *              windTurbines:
 *                  type: object
 *                  required: ["active", "maximumProduction", "cutinWindspeed", "cutoutWindspeed"]
 *                  properties:
 *                      active:
 *                          type: number
 *                          minimum: 0
 *                      maximumProduction:
 *                          type: number
 *                          minimum: 0
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
 *              sellLimit:
 *                  type: object
 *                  required: ["start", "end"]
 *                  properties:
 *                      start:
 *                          type: string
 *                          format: date-time
 *                      end:
 *                          type: string
 *                          format: date-time
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
 *      Market:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  description: Must be unique.
 *              demand:
 *                  type: number
 *                  description: Market demand in kilowatthours (kWh).
 *                  minimum: 0
 *              supply:
 *                  type: number
 *                  description: Market supply in kilowatthours (kWh).
 *                  minimum: 0
 *              basePrice:
 *                  type: number
 *                  description: The price if demand == supply, currency sek
 *              price:
 *                  type: object
 *                  properties:
 *                      validUntil:
 *                          type: string
 *                          format: date-time
 *                      updatedAt:
 *                          type: string
 *                          format: date-time
 *                      value:
 *                          type: number
 *                          example: 2.31
 *                          minimum: 0
 *                      currency:
 *                          type: string
 *                          example: sek
 *      Powerplant:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *              active:
 *                  type: boolean
 *              energySource:
 *                  type: string
 *              production:
 *                  type: object
 *                  properties:
 *                      updatedAt:
 *                          type: string
 *                          format: date-time
 *                      value:
 *                          type: number
 *                          description: Electricity production in kilowatthours (kWh).
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
 *                                  location:
 *                                      type: object
 *                                      properties:
 *                                          latitude:
 *                                              type: number
 *                                              minimum: -90
 *                                              maximum: 90
 *                                          longitude:
 *                                              type: number
 *                                              minimum: -180
 *                                              maximum: 180
 *          500:
 *              description: Internal server error
 */
simulatorRouter.get("/grid/blackouts", authorize(Roles.admin), async (req, res) => {
    const query = { blackout: true };
    const fields = "_id name owner location";

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
simulatorRouter.get("/households/u/:id", authorize(Roles.admin, Roles.user), async (req, res) => {
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
 * /simulator/household/:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get all households that belongs to the requester.
 *      responses:
 *          200:
 *              description: A list of all household that belongs to the requester. <br/><br/> If the user does not own any households, the response will be an empty array.
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
 *          500:
 *              description: Internal server error
 *
 */
simulatorRouter.get("/household/", authorize(Roles.user), async (req, res) => {
    const userid = req.user.uid;

    try {
        const households = await HouseholdCollection.find({ owner: userid }).exec();
        return res.status(200).send(households);
    } catch (error) {
        return res.status(500).send();
    }
});

/**
 * @openapi
 * /simulator/household:
 *  post:
 *      tags:
 *          - Simulator
 *      description: Create a new household with the requester as owner
 *      requestBody:
 *          description: Information about household to create. <br/><br/> NOTE&colon; Specifying `owner` will not have any effect.
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
simulatorRouter.post("/household/", authorize(Roles.admin, Roles.user), async (req, res) => {
    const household = req.body;
    if (objectIsEmpty(household)) return res.status(400).send(["Empty request body, no household found"]);

    if (household.hasOwnProperty("_id")) delete household._id; // Prevent user to set document id
    if (household.hasOwnProperty("sellLimit")) delete household.sellLimit; // Prevent user to set sell limit

    household.owner = req.user.uid;
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
simulatorRouter.get("/household/:id", authorize(Roles.admin, Roles.user), async (req, res) => {
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
    if (userIsAdminOrHouseholdOwner(req.user, household)) return res.status(200).send(household);
    else return res.status(403).send();
});

/**
 * @openapi
 * /simulator/household/{id}:
 *  patch:
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
simulatorRouter.patch("/household/:id", authorize(Roles.admin, Roles.user), async (req, res) => {
    const changes = req.body;
    const householdId = req.params.id;

    if (!isValidId(householdId)) return res.status(400).send(["Invalid household id"]);
    if (objectIsEmpty(changes)) return res.status(400).send(["Empty request body, no changes found"]);

    let householdDoc;
    try {
        householdDoc = await HouseholdCollection.findById(householdId).exec();
    } catch (err) {
        return res.status(500).send();
    }

    if (!householdDoc) {
        return res.status(404).send();
    } else if (!userIsAdminOrHouseholdOwner(req.user, householdDoc)) {
        return res.status(403).send();
    }
    householdDoc.set(flattenObject(changes));

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
 *          500:
 *              description: Internal server error
 *
 *
 */
simulatorRouter.delete("/household/:id", authorize(Roles.admin, Roles.user), async (req, res) => {
    const householdId = req.params.id;

    if (!isValidId(householdId)) return res.status(400).send();

    try {
        const query = {
            _id: householdId,
            ...(!userIsAdmin(req.user) && { owner: req.user.uid })
        };
        const household = await HouseholdCollection.findOne(query).remove().exec();
        if (household.deletedCount === 0) return res.status(404).send();
    } catch (err) {
        return res.status(500).send();
    }
    return res.status(204).send();
});

/**
 * @openapi
 * /simulator/household/{id}/latest/{collection}:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get latest value of a parameter (defined in `collection`) of a household
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of household
 *            required: true
 *            schema:
 *                type: string
 *          - name: collection
 *            in: path
 *            description: Parameter to request historical data of.
 *            required: true
 *            schema:
 *                type: string
 *                enum:
 *                    - battery
 *                    - production
 *                    - consumption
 *                    - transmission
 *      responses:
 *          200:
 *              description: Ok. <br/><br/>The response type will be different based on the specified `collection` parameter. However, only one schema type will be used at once.
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/schemas/Battery'
 *                              - $ref: '#/components/schemas/Production'
 *                              - $ref: '#/components/schemas/Consumption'
 *                              - $ref: '#/components/schemas/Transmission'
 *          400:
 *              description: Bad request, see response body for a list of errors.
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
 */
simulatorRouter.get(
    "/household/:id/latest/:collection/",
    authorize(Roles.admin, Roles.user),
    async (req, res) => {
        const householdId = req.params.id;
        const collection: historyParameter = historyParameter[req.params.collection?.toLowerCase()];
        if (!isValidId(householdId)) return res.status(400).send(["Invalid household id"]);

        let historyCollection;
        switch (collection) {
            case historyParameter.battery:
                historyCollection = BatteryHistoryCollection;
                break;
            case historyParameter.consumption:
                historyCollection = ConsumptionHistoryCollection;
                break;
            case historyParameter.production:
                historyCollection = ProductionHistoryCollection;
                break;
            case historyParameter.transmission:
                historyCollection = TransmissionHistoryCollection;
                break;
            default:
                return res.status(400).send(["Invalid history parameter"]);
        }

        let historicalData: Array<any>;
        let household: boolean;
        try {
            [historicalData, household] = await Promise.all([
                historyCollection
                    .findOne({ household: householdId })
                    .sort({ timestamp: -1 })
                    .select("-_id")
                    .exec(),
                HouseholdCollection.findOne({ _id: householdId }).exec()
            ]);
        } catch (error) {
            return res.status(500).send();
        }

        if (!household) return res.status(404).send();
        if (!userIsAdminOrHouseholdOwner(req.user, household)) return res.status(403).send();
        else return res.status(200).send(historicalData);
    }
);

/**
 * @openapi
 * /simulator/household/{id}/history/{collection}/{from}:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get history from a household between two dates.
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of household
 *            required: true
 *            schema:
 *                type: string
 *          - name: collection
 *            in: path
 *            description: Parameter to request historical data of.
 *            required: true
 *            schema:
 *                type: string
 *                enum:
 *                    - battery
 *                    - production
 *                    - consumption
 *                    - transmission
 *          - name: from
 *            in: path
 *            description: Date or datetime to get battery history from. Value can also be number of milliseconds since Jan 1, 1970, 00:00:00.000 GMT.
 *            required: true
 *            schema:
 *                type: string
 *                format: date-time
 *          - name: to
 *            in: query
 *            description: Date or datetime to get battery history to. Value can also be number of milliseconds since Jan 1, 1970, 00:00:00.000 GMT. If empty, the value will be time now.
 *            required: false
 *            schema:
 *                type: string
 *                format: date-time
 *      responses:
 *          200:
 *              description: Ok. <br/><br/>The response type will be different based on the specified `collection` parameter. However, only one schema type will be used at once.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              oneOf:
 *                                  - $ref: '#/components/schemas/Battery'
 *                                  - $ref: '#/components/schemas/Production'
 *                                  - $ref: '#/components/schemas/Consumption'
 *                                  - $ref: '#/components/schemas/Transmission'
 *          400:
 *              description: Bad request, see response body for a list of errors.
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
 */
simulatorRouter.get(
    "/household/:id/history/:collection/:from",
    authorize(Roles.admin, Roles.user),
    async (req, res) => {
        const householdId = req.params.id;
        const collection: historyParameter = historyParameter[req.params.collection?.toLowerCase()];
        const dateFrom = new Date(req.params.from);
        const dateTo = req.params.to ? new Date(req.query.to?.toString()) : new Date();

        if (!isValidDate(dateFrom) || !isValidDate(dateTo)) return res.status(400).send(["Invalid date"]);
        if (!isValidId(householdId)) return res.status(400).send(["Invalid household id"]);

        const query = { timestamp: { $gte: dateFrom, $lte: dateTo }, household: householdId };
        const fields = "-_id";

        let historyCollection;
        switch (collection) {
            case historyParameter.battery:
                historyCollection = BatteryHistoryCollection;
                break;
            case historyParameter.consumption:
                historyCollection = ConsumptionHistoryCollection;
                break;
            case historyParameter.production:
                historyCollection = ProductionHistoryCollection;
                break;
            case historyParameter.transmission:
                historyCollection = TransmissionHistoryCollection;
                break;
            default:
                return res.status(400).send(["Invalid history parameter"]);
        }

        let historicalData: Array<any>;
        let household: boolean;
        try {
            [historicalData, household] = await Promise.all([
                historyCollection.find(query).select(fields).exec(),
                HouseholdCollection.findOne({ _id: householdId }).exec()
            ]);
        } catch (error) {
            return res.status(500).send();
        }

        if (!household) return res.status(404).send();
        if (!userIsAdminOrHouseholdOwner(req.user, household)) return res.status(403).send();
        else return res.status(200).send(historicalData);
    }
);

/**
 * @openapi
 * /simulator/windspeed/:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get windspeed history between two dates
 *      parameters:
 *          - name: from
 *            in: query
 *            description: date or datetime to get windspeed history from. Value can also be number of milliseconds since Jan 1, 1970, 00:00:00.000 GMT.
 *            required: false
 *            schema:
 *                type: string
 *                format: date-time
 *          - name: to
 *            in: query
 *            description: date or datetime to get windspeed history to. Value can also be number of milliseconds since Jan 1, 1970, 00:00:00.000 GMT. If empty, the value will be time now.
 *            required: false
 *            schema:
 *                type: string
 *                format: date-time
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - type: array
 *                                items:
 *                                    $ref: "#/components/schemas/Windspeed"
 *                              - $ref: "#/components/schemas/Windspeed"
 *
 *          400:
 *              description: Bad request, see response body for a list of errors.
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
simulatorRouter.get("/windspeed/", authorize(Roles.admin, Roles.user), async (req, res) => {
    const dateFromQuery = req.query.from?.toString();
    const dateToQuery = req.query.to?.toString();

    if (!dateFromQuery && !dateToQuery) {
        try {
            const windspeed = await getLatestWindspeed();
            if (!windspeed) return res.status(200).send({ timestamp: undefined, windspeed: undefined });
            else return res.status(200).send(windspeed);
        } catch (error) {
            return res.status(500).send();
        }
    }

    const dateFrom = new Date(dateFromQuery);
    const dateTo = dateToQuery ? new Date(dateToQuery) : new Date();

    if (!isValidDate(dateFrom) || !isValidDate(dateTo)) return res.status(400).send(["Invalid date"]);

    const query = { timestamp: { $gte: dateFrom, $lte: dateTo } };
    const fields = "-_id";

    let historicalData: Array<any>;
    try {
        historicalData = await WindspeedCollection.find(query).select(fields).exec();
    } catch (error) {
        return res.status(500).send();
    }

    return res.status(200).send(historicalData);
});

/**
 * @openapi
 * /simulator/market/:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get information about market.
 *      parameters:
 *          - name: name
 *            in: query
 *            description: Name of market
 *            required: false
 *            schema:
 *                type: string
 *                default: default
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Market"
 *          400:
 *              description: Bad request, see response body for a list of errors.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: string
 *          404:
 *              description: A market with the specified name could not be found.
 *          500:
 *              description: Internal server error
 */
simulatorRouter.get("/market/", authorize(Roles.admin, Roles.user), async (req, res) => {
    const marketName = req.query.name || "default";
    if (typeof marketName !== "string" || marketName.length === 0)
        return res.status(400).send(["Invalid marketname"]);

    let market;
    try {
        market = await MarketCollection.findOne({ name: marketName }).select("-_id").exec();
    } catch (error) {
        return res.status(500).send();
    }

    if (market === null) return res.status(404).send();
    return res.status(200).send(market);
});

/**
 * @openapi
 * /simulator/market/:
 *  patch:
 *      tags:
 *          - Simulator
 *      description: Update information about market. <br/><br/> NOTE&colon; Name of market cannot be changed.
 *      parameters:
 *          - name: name
 *            in: query
 *            description: Name of market
 *            required: false
 *            schema:
 *                type: string
 *                default: default
 *      requestBody:
 *          description: Information to update
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Market"
 *      responses:
 *          200:
 *              description: Ok
 *          400:
 *              description: Bad request, see response body for a list of errors.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: string
 *          404:
 *              description: A market with the specified name could not be found.
 *          500:
 *              description: Internal server error
 */
simulatorRouter.patch("/market/", authorize(Roles.admin), async (req, res) => {
    const marketName = req.query.name || "default";
    const marketChanges = req.body;

    if (marketChanges.hasOwnProperty("name")) delete marketChanges.name; // Prevent requester to change marketname
    if (typeof marketName !== "string" || marketName.length === 0)
        return res.status(400).send(["Invalid marketname"]);
    if (objectIsEmpty(marketChanges))
        return res.status(400).send(["Empty request body, no status change found"]);

    try {
        const market = await MarketCollection.findOneAndUpdate(
            { name: marketName },
            flattenObject(marketChanges),
            { runValidators: true }
        ).exec();
        if (!market) return res.status(404).send();
    } catch (error) {
        if (error.name === "ValidationError") {
            let errorMessages = [];
            for (const err in error.errors) {
                errorMessages.push(error.errors[err].message);
            }

            return res.status(400).send(errorMessages);
        } else return res.status(500).send();
    }
    return res.status(200).send();
});

/**
 * @openapi
 * /simulator/market/limit/:
 *  put:
 *      tags:
 *          - Simulator
 *      description: Limit a household from selling electricity in a period of time.
 *      requestBody:
 *          description: Information about sell limit
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: ["householdId", "start", "end"]
 *                      properties:
 *                          householdId:
 *                              type: string
 *                          start:
 *                              type: string
 *                              format: date-time
 *                          end:
 *                              type: string
 *                              format: date-time
 *      responses:
 *          200:
 *              description: Ok
 *          400:
 *              description: Bad request, see response body for a list of errors.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: string
 *          403:
 *              description: The requester does not have sufficient permissions.
 *          500:
 *              description: Internal server error
 */
simulatorRouter.put("/market/limit/", authorize(Roles.admin), async (req, res) => {
    const requestBody = req.body;
    const householdId = requestBody.householdId;
    const dateStart = new Date(requestBody?.start);
    const dateEnd = new Date(requestBody?.end);

    if (objectIsEmpty(requestBody)) return res.status(400).send(["Limit information cannot be empty"]);
    if (!isValidDate(dateStart) || !isValidDate(dateEnd)) return res.status(400).send(["Invalid date"]);
    if (!isValidId(householdId)) return res.status(400).send(["Invalid household id"]);

    try {
        const household = await HouseholdCollection.findOneAndUpdate(
            { _id: householdId },
            { sellLimit: { start: dateStart, end: dateEnd } },
            { runValidators: true, new: true }
        ).exec();
        if (!household) return res.status(404).send();
    } catch (error) {
        if (error.name === "ValidationError") {
            let errorMessages = [];
            for (const err in error.errors) {
                errorMessages.push(error.errors[err].message);
            }

            return res.status(400).send(errorMessages);
        } else return res.status(500).send();
    }

    return res.status(200).send();
});

/**
 * @openapi
 * /simulator/market/limit/{id}:
 *  delete:
 *      tags:
 *          - Simulator
 *      description: Limit a household from selling electricity in a period of time.
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of household
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: Ok
 *          400:
 *              description: Bad request, see response body for a list of errors.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: string
 *          403:
 *              description: The requester does not have sufficient permissions.
 *          500:
 *              description: Internal server error
 */
simulatorRouter.delete("/market/limit/:id", authorize(Roles.admin), async (req, res) => {
    const householdId = req.params.id;
    if (!isValidId(householdId)) return res.status(400).send(["Invalid household id"]);

    try {
        await HouseholdCollection.findOneAndUpdate({ _id: householdId }, { $unset: { sellLimit: 1 } }).exec();
    } catch (error) {
        if (error.name === "DocumentNotFoundError") return res.status(404).send();
        else return res.status(500).send();
    }

    return res.status(200).send();
});

/**
 * @openapi
 * /simulator/powerplant/status:
 *  get:
 *      tags:
 *          - Simulator
 *      description: Get status of powerplant.
 *      parameters:
 *          - name: name
 *            in: query
 *            description: Name of powerplant
 *            required: false
 *            schema:
 *                type: string
 *                default: default
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Powerplant"
 *          400:
 *              description: Bad request, see response body for a list of errors.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: string
 *          403:
 *              description: The requester does not have sufficient permissions.
 *          500:
 *              description: Internal server error
 */
simulatorRouter.get("/powerplant/status", authorize(Roles.admin), async (req, res) => {
    const powerplantName = req.query.name || "default";

    if (typeof powerplantName !== "string" || powerplantName.length === 0)
        return res.status(400).send(["Invalid powerplantname"]);

    let powerplant;
    try {
        powerplant = await PowerplantCollection.findOne({ name: powerplantName }).select("-_id").exec();
    } catch (error) {
        return res.status(500).send();
    }

    if (powerplant === null) return res.status(404).send();
    return res.status(200).send(powerplant);
});

/**
 * @openapi
 * /simulator/powerplant/status:
 *  put:
 *      tags:
 *          - Simulator
 *      description: Set status of powerplant.
 *      parameters:
 *          - name: name
 *            in: query
 *            description: Name of powerplant
 *            required: false
 *            schema:
 *                type: string
 *                default: default
 *      requestBody:
 *          description: status to set
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: ["active"]
 *                      properties:
 *                          active:
 *                              type: boolean
 *      responses:
 *          200:
 *              description: Ok
 *          400:
 *              description: Bad request, see response body for more details.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          403:
 *              description: The requester does not have sufficient permissions.
 *          500:
 *              description: Internal server error
 */
simulatorRouter.put("/powerplant/status", authorize(Roles.admin), async (req, res) => {
    const powerplantName = req.query.name || "default";
    const powerplantStatus = req.body;

    if (objectIsEmpty(powerplantStatus))
        return res.status(400).send(["Empty request body, no status change found"]);
    if (typeof powerplantName !== "string" || powerplantName.length === 0)
        return res.status(400).send(["Invalid powerplantname"]);

    try {
        await PowerplantCollection.findOneAndUpdate(
            { name: powerplantName },
            { active: powerplantStatus.active }
        ).exec();
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
