var mongoose = require("mongoose");

interface Windspeed {
    timestamp: Date;
    windspeed: number;
}

var windspeedSchema = new mongoose.Schema(
    {
        timestamp: Date,
        windspeed: Number
    },
    { versionKey: false }
);

export const windspeed = mongoose.model("windspeed", windspeedSchema);

/**
 *
 * @returns If last value exists, last windspeed value. Otherwise, undefined.
 */
export async function getLatestWindspeed() {
    try {
        return await windspeed.findOne().sort({ timestamp: -1 }).select("-_id").exec();
    } catch (error) {
        return undefined;
    }
}
