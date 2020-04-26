import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import User from "../entity/User";
import { jwtSecret, jwtExpire } from "../config";

export default class AuthController {
    static async login(request: Request, response: Response) {
        // Check if username and password are set
        let { username, password } = request.body;
        if (!(username && password)) {
            response.status(400).send(); // Bad Request
        }

        // Get user from database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where: { username } });
        } catch (error) {
            response.status(401).send(); // Unauthorized | username not in db
        }

        // Check if encrypted password matches
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            response.status(401).send(); // Unauthorized | invalid password
            return;
        }

        // Sign token - expires in config.jwtExpire
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            jwtSecret,
            { expiresIn: jwtExpire }
        );

        // Send the jwt in the response
        response.send(token);
    }

    static async changePassword (request: Request, response: Response) {
        // Get ID from JWT
        const id = response.locals.jwtPayload.userId;

        // Get parameters from the body
        const { oldPassword, newPassword } = request.body;
        if (!(oldPassword && newPassword)) {
            response.status(400).send(); // Bad Request
        }

        // Get user from the database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            response.status(401).send(); // Unauthorized | id not in db
        }

        // Check if old password matches
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            response.status(401).send();
            return;
        }

        // Validate the user model (password length)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            response.status(400).send(errors); // Bad request | password not valid
            return;
        }

        // Hash the new password and save
        user.hashPassword();
        userRepository.save(user);

        response.status(204).send(); // No content
    }
}

