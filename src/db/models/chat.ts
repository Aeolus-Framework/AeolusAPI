var mongoose = require("mongoose");

export class Message {
    timestamp: Date;
    sender: string;
    message: string;

    constructor(data: Partial<Message>) {
        Object.assign<Message, Partial<Message>>(this, data);
    }
}

export class Chat {
    owner: string;
    name: string;
    closed: boolean;
    participants: string[];
    conversation: Message[];
}

var messageSchema = new mongoose.Schema(
    {
        timestamp: { type: Date, required: true },
        sender: { type: String, required: true },
        message: { type: String, required: true }
    },
    { _id: false }
);

var chatSchema = new mongoose.Schema(
    {
        owner: { type: String, required: true },
        closed: { type: Boolean, required: false, default: false },
        name: { type: String, required: false, default: "" },
        participants: { type: [String], required: false, default: [] },
        conversation: { type: [messageSchema], required: false, default: [] }
    },
    { versionKey: false }
);

export const chat = mongoose.model("chat", chatSchema);
