import express from "express";

export const socialRouter = express.Router();

function respondWithReqUrl(req: any): string {
    return `You have navigated to <a href="${req.originalUrl}">${req.originalUrl}</a>`;
}

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
 *      ChatInfo:
 *          description: General information about a chat
 *          type: object
 *          properties:
 *              owner:
 *                  type: string
 *              name:
 *                  type: string
 *              closed:
 *                  type: boolean
 *              partipicants:
 *                  type: array
 *                  items:
 *                      type: string
 *      Chat:
 *          description: Messages and general information about a chat
 *          allOf:
 *              - $ref: "#/components/schemas/ChatInfo"
 *              - type: object
 *                properties:
 *                    id:
 *                       type: string
 *                    conversation:
 *                        type: array
 *                        items:
 *                           $ref: "#/components/schemas/Message"
 *      Userprofile:
 *          description: Contains information about a user
 *          type: object
 *          properties:
 *              firstname:
 *                  type: string
 *              lastname:
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
socialRouter.get("/chat", (req, res) => {
    res.send(respondWithReqUrl(req));
});

/**
 * @openapi
 * /social/chat:
 *  post:
 *      tags:
 *          - Social
 *      description: Create a new chat that belongs to the requester
 *      requestBody:
 *          description: Information about chat to create
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/ChatInfo"
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
socialRouter.post("/chat", (req, res) => {
    res.send(respondWithReqUrl(req));
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
 *                      $ref: "#/components/schemas/ChatInfo"
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
    res.send(respondWithReqUrl(req));
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
    res.send(respondWithReqUrl(req));
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
    res.send(respondWithReqUrl(req));
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
 */
socialRouter.get("/user/:id", (req, res) => {
    res.send(respondWithReqUrl(req));
});

/**
 * @openapi
 * /social/user/{id}:
 *  put:
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
 */
socialRouter.put("/user/:id", (req, res) => {
    res.send(respondWithReqUrl(req));
});
