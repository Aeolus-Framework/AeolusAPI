import { Schema, model } from "mongoose";

interface Windspeed {
    timestamp: Date;
    windspeed: number;
}

var windspeedSchema = new Schema<Windspeed>(
    {
        timestamp: Date,
        windspeed: Number
    },
    { versionKey: false }
);

export const windspeed = model<Windspeed>("windspeed", windspeedSchema);
