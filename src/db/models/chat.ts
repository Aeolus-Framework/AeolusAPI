var mongoose = require("mongoose");

interface Chat {
    owner: string;
    name: string;
    closed: boolean;
    participants: string[];
    conversation: {
        timestamp: Date;
        sender: string;
        message: string;
    }[];
}

var chatSchema = new mongoose.Schema(
    {
        owner: Boolean,
        closed: Boolean,
        name: String,
        participants: [String],
        conversation: [
            {
                timestamp: Date,
                sender: String,
                message: String
            }
        ]
    },
    { versionKey: false }
);

export const chat = mongoose.model("batteryHistory", chatSchema);
