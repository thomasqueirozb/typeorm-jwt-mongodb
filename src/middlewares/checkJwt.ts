import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import {jwtSecret, jwtExpire } from "../config";

export default function checkJwt(request: Request, response: Response, next: NextFunction) {
    if (process.env.disableSecurity=="1") {
        next();
        return;
    }

    // Get the jwt token from the request header "auth"
    const token = <string>request.headers["auth"];
    let jwtPayload;

    // Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, jwtSecret);
        response.locals.jwtPayload = jwtPayload;
    } catch (error) {
        // If token is not valid, respond with 401 (unauthorized)
        response.status(401).send();
        return;
    }

    // The token is valid for 1 hour by default. Value is stored in .env
    // We want to send a new token on every request
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, jwtSecret, {
        expiresIn: jwtExpire
    });
    response.setHeader("token", newToken);

    // Call the next middleware or controller
    next();
}
