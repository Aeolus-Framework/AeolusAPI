var mongoose = require("mongoose");

export enum DashboardCardType {
    Consumption,
    Production,
    Buffer,
    ProductionEfficiency,
    WindSpeed,
    Temperature,
    PricePerkWh
}

export enum LoginProvider {
    Google = "Google"
}

interface Userprofile {
    firstname: string;
    lastname: string;
    role: string;
    email: string;
    enabled: boolean;
    disabledUntil?: Date;
    dashboard: DashboardCardType[];
    loginProvider: LoginProvider;
}

var userprofileSchema = new mongoose.Schema(
    {
        firstname: { type: String, required: true, trim: true },
        lastname: { type: String, required: true, trim: true },
        role: { type: String, required: true },
        email: { type: String, required: true, trim: true },
        enabled: { type: Boolean, required: true },
        disabledUntil: Date,
        dashboard: { type: [Number], required: true, default: [0, 1, 2, 3, 4] },
        loginProvider: { type: String, required: true }
    },
    { versionKey: false }
);

export const userprofile = mongoose.model("userprofile", userprofileSchema);
