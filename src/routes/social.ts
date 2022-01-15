import express from "express";
import { authorize, Roles } from "../middleware/auth";

import { chat as ChatCollection } from "../db/models/chat";
import { userprofile as UserProfileCollection } from "../db/models/userprofile";
import { isValidId } from "../util/validators/mongodbValidator";
import { userIsAdmin } from "../util/routeHelpers";
import flattenObject from "../util/object/flatten";

export const socialRouter = express.Router();

/**
 * @openapi
 * components:
 *  schemas:
 *      Message:
 *          description: Represent a chat message
 *          type: object
 *          properties:
 *              timestamp:
 *                  type: string
 *                  format: date-time
 *              sender:
 *                  type: string
 *              message:
 *                  type: string
 *      Chat:
 *          description: Messages and general information about a chat
 *          type: object
 *          properties:
 *              _id:
 *                 type: string
 *              owner:
 *                  type: string
 *              name:
 *                  type: string
 *              closed:
 *                  type: boolean
 *              participants:
 *                  type: array
 *                  items:
 *                      type: string
 *              conversation:
 *                  type: array
 *                  items:
 *                     $ref: "#/components/schemas/Message"
 *      Userprofile:
 *          description: Contains information about a user
 *          type: object
 *          properties:
 *              firstname:
 *                  type: string
 *              lastname:
 *                  type: string
 *              profilePicture:
 *                  type: string
 *              email:
 *                  type: string
 *              enabled:
 *                  type: boolean
 *              disabledUntil:
 *                  type: string
 *                  format: date-time
 *              dashboard:
 *                  type: array
 *                  items:
 *                      type: number
 *              loginProvider:
 *                  type: string
 *
 */

/**
 * @openapi
 * /social/chat:
 *  get:
 *      tags:
 *          - Social
 *      description: Get all chats that belongs to the requester
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Chat"
 */
socialRouter.get("/chat", authorize(Roles.admin, Roles.user), async (req, res) => {
    const userId = req.user.uid;

    try {
        const chats = await ChatCollection.find({
            $or: [{ owner: userId }, { participants: userId }]
        }).exec();
        return res.status(200).send(chats);
    } catch (error) {
        return res.status(500).send();
    }
});

/**
 * @openapi
 * /social/chat:
 *  post:
 *      tags:
 *          - Social
 *      description: Create a new chat that belongs to the requester
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Chat"
 *          400:
 *              description: Bad request, see response body for more details.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 */
socialRouter.post("/chat", authorize(Roles.admin, Roles.user), async (req, res) => {
    const userId = req.user.uid;
    const chatDocument = new ChatCollection({ owner: userId });

    try {
        const chat = await chatDocument.save();
        return res.status(200).send(chat);
    } catch (error) {
        res.status(500).send();
    }
});

/**
 * @openapi
 * /social/chat/{id}:
 *  put:
 *      tags:
 *          - Social
 *      description: Create a new chat that belongs to the requester
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of chat
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          description: Information about chat to update
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Chat"
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Chat"
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
 *              description: The chat could not be found.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 */
socialRouter.put("/chat/:id", (req, res) => {
    res.status(501).send();
});

/**
 * @openapi
 * /social/chat/{id}/{userToInvite}:
 *  put:
 *      tags:
 *          - Social
 *      description: Invite a new participant to a chat
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of chat
 *            required: true
 *            schema:
 *              type: string
 *          - name: userToInvite
 *            in: path
 *            description: id of user to invite
 *            required: true
 *            schema:
 *              type: string
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
 *          404:
 *              description: The chat or user could not be found, see response body for more details.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 */
socialRouter.put("/chat/:id/:userToInvite", (req, res) => {
    res.status(501).send();
});

/**
 * @openapi
 * /social/chat/{id}/{userToInvite}:
 *  delete:
 *      tags:
 *          - Social
 *      description: Remove a participant from a chat
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of chat
 *            required: true
 *            schema:
 *              type: string
 *          - name: userToInvite
 *            in: path
 *            description: id of user to remove
 *            required: true
 *            schema:
 *              type: string
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
 *          404:
 *              description: The chat or user could not be found, see response body for more details.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 */
socialRouter.delete("/chat/:id/:userToRemove", (req, res) => {
    res.status(501).send();
});

/**
 * @openapi
 * /social/user/:
 *  get:
 *      tags:
 *          - Social
 *      description: Get information about the requester&#39;s userprofile
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Userprofile"
 *          404:
 *              description: The household could not be found.
 *          500:
 *              description: Internal server error
 */
socialRouter.get("/user/", authorize(Roles.admin, Roles.user), async (req, res) => {
    const userId = req.user.uid;

    let userprofile;
    try {
        userprofile = await UserProfileCollection.findById(userId).exec();
    } catch (error) {
        return res.status(500).send();
    }
    if (userprofile === null) return res.status(404).send();
    else return res.status(200).send(userprofile);
});

/**
 * @openapi
 * /social/user/{id}:
 *  get:
 *      tags:
 *          - Social
 *      description: Get information about a user
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of user
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Userprofile"
 *          404:
 *              description: The household could not be found.
 *          500:
 *              description: Internal server error
 */
socialRouter.get("/user/:id", authorize(Roles.admin, Roles.user), async (req, res) => {
    const userId = req.params.id;

    let userprofile;
    try {
        userprofile = await UserProfileCollection.findById(userId).exec();
    } catch (error) {
        return res.status(500).send();
    }
    if (userprofile === null) return res.status(404).send();
    else return res.status(200).send(userprofile);
});

/**
 * @openapi
 * /social/user/{id}:
 *  patch:
 *      tags:
 *          - Social
 *      description: Update information about a user
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of user
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          description: Information about user to update
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Userprofile"
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
 *          404:
 *              description: The household could not be found.
 *          500:
 *              description: Internal server error
 */
socialRouter.patch("/user/:id", authorize(Roles.admin, Roles.user), async (req, res) => {
    const changes = req.body;
    const userID = req.params.id;

    if (!isValidId(userID)) return res.status(400).send(["Invalid household id"]);

    let userprofileDoc;
    try {
        userprofileDoc = await UserProfileCollection.findById(userID).exec();
    } catch (err) {
        return res.status(500).send();
    }

    if (!userprofileDoc) {
        return res.status(404).send();
    } else if (!userIsAdmin(req.user) || req.user.uid === userprofileDoc._id) {
        return res.status(403).send();
    }

    userprofileDoc.set(flattenObject(changes));

    try {
        await userprofileDoc.save();
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
 * /social/user/{id}:
 *  get:
 *      tags:
 *          - Social
 *      description: Get information about a user
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id of user
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Userprofile"
 *          404:
 *              description: The household could not be found.
 *          500:
 *              description: Internal server error
 */
socialRouter.get("/user/:id", authorize(Roles.admin, Roles.user), async (req, res) => {
    const userId = req.params.id;

    let userprofile;
    try {
        userprofile = await UserProfileCollection.findById(userId).exec();
    } catch (error) {
        return res.status(500).send();
    }
    if (userprofile === null) return res.status(404).send();
    else return res.status(200).send(userprofile);
});
