import { type Request } from "express";
import { Roles } from "../middleware/auth";

export function userIsAdminOrHouseholdOwner(user: Request["user"], household: any): boolean {
    return userIsAdmin(user) || userIsHouseholdOwner(user, household);
}

export function userIsAdmin(user: Request["user"]): boolean {
    return user?.role === Roles.admin;
}

export function userIsHouseholdOwner(user: Request["user"], household: any): boolean {
    return user?.uid === household?.owner;
}
