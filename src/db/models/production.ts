import { Schema, model } from "mongoose";

interface Production {
    timestamp: Date;
    household: string;
    production: number;
}

var productionSchema = new Schema<Production>(
    {
        timestamp: Date,
        household: String,
        production: Number
    },
    { versionKey: false }
);

export const production = model<Production>("production", productionSchema);
