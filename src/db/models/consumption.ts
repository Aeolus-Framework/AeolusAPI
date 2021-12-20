import { Schema, model } from "mongoose";

interface Consumption {
    timestamp: Date;
    household: string;
    consumption: number;
}

var consumptionSchema = new Schema<Consumption>(
    {
        timestamp: Date,
        household: String,
        consumption: Number
    },
    { versionKey: false }
);

export const consumption = model<Consumption>("consumption", consumptionSchema);
