import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import User from "../entity/User";
import { disableSecurity } from "../config";

export default function checkRole(roles: Array<string>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (disableSecurity == "1") {
            next();
            return;
        }
        // Get the user ID from previous midleware
        const id = res.locals.jwtPayload.userId;

        // Get user role from the database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            res.status(401).send(); // Unauthorized | User does not exist
            return;
        }

        // Check if array of authorized roles includes the user's role
        if (roles.indexOf(user.role) > -1) next();
        else res.status(401).send(); // Unauthorized | Role does not match
    };
}

