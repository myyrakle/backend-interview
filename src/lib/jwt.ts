import * as jwt from "jsonwebtoken";
import { readFileSync } from "fs";

export function makeAccessToken(value: any) {
    const keyValue = readFileSync("/key");
    return jwt.sign(value, keyValue, { expiresIn: "1h" });
}

export function makeRefreshToken(value: any) {
    const keyValue = readFileSync("/key");
    return jwt.sign(value, keyValue, { expiresIn: "100d" });
}
