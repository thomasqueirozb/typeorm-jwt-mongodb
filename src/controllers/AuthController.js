import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

class AuthController {
    static login = async (req: Request, res: Response) => {
        // Check if username and password are set
        let { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).send(); // Bad Request
        }

        // Get user from database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where: { username } });
        } catch (error) {
            res.status(401).send(); // Unauthorized | username not in db
        }

        // Check if encrypted password matches
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send(); // Unauthorized | invalid password
            return;
        }

        // Sign token - expires in config.jwtExpire
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            config.jwtSecret,
            { expiresIn: config.jwtExpire }
        );

        // Send the jwt in the response
        res.send(token);
    };

    static changePassword = async (req: Request, res: Response) => {
        // Get ID from JWT
        const id = res.locals.jwtPayload.userId;

        // Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send(); // Bad Request
        }

        // Get user from the database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            res.status(401).send(); // Unauthorized | id not in db
        }

        // Check if old password matches
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send();
            return;
        }

        // Validate the user model (password length)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors); // Bad request | password not valid
            return;
        }

        // Hash the new password and save
        user.hashPassword();
        userRepository.save(user);

        res.status(204).send(); // No content
    };
}
export default AuthController;

