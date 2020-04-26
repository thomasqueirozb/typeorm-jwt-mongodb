import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import User from "../entity/User";

export default class UserController {
    static async listAll(request: Request, response: Response, next: NextFunction) {
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: ["id", "username", "role"] // No passwords
        });

        response.send(users); // Send all the users
    }
    static async getOneById(request: Request, response: Response, next: NextFunction) {
        // Get the ID from the url
        const id = request.params.id;

        const userRepository = getRepository(User);
        // Get the user from database
        try {
            const user = await userRepository.findOneOrFail(id, {
                select: ["id", "username", "role"] // No passwords
            });
        } catch (error) {
            response.status(404).send("User not found");
        }
    }

    static async newUser(request: Request, response: Response, next: NextFunction){
        let user = new User();
        user.username = request.body.username;
        user.password = request.body.password;
        user.role = request.body.role;
        user.firstName = request.body.firstName;
        user.lastName = request.body.lastName;
        user.birthday = request.body.lastName;

        // Validate if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            response.status(400).send(errors);
            return;
        }

        // Hash the password, to securely store on DB
        user.hashPassword();

        const userRepository = getRepository(User);
        // Try to save. If fails, the username is already in use
        try {
            await userRepository.save(user);
        } catch (e) {
            response.status(409).send("username already in use");
            return;
        }

        //If all ok, send 201 response
        response.status(201).send("User created");
    }

    static async editUser(request: Request, response: Response, next: NextFunction) {
        // Get the ID from the url
        const id = request.params.id;

        // Get values from the body
        const { username, role } = request.body;

        const userRepository = getRepository(User);
        // Try to find user on database
        let user;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            // If not found, send a 404 response
            response.status(404).send("User not found");
            return;
        }

        // Validate the new values on model
        user.username = username;
        user.role = role;
        const errors = await validate(user);
        if (errors.length > 0) {
            response.status(400).send(errors); // Bad request
            return;
        }

        // Try to save, if fails, that means username already in use
        try {
            await userRepository.save(user);
        } catch (e) {
            response.status(409).send("Username already in use"); // Conflict
            return;
        }

        response.status(204).send(); // No content
    }

    static async deleteUser(request: Request, response: Response, next: NextFunction) {
        // Get the ID from the url
        const id = request.params.id;

        let user: User;
        const userRepository = getRepository(User);
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            response.status(404).send("User not found");
            return;
        }
        userRepository.delete(id);

        response.status(204).send(); // No content
    }
}
