import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

export class UserController {

    private userRepository = getRepository(User);

    async listAll(request: Request, response: Response, next: NextFunction) {
        const users = await this.userRepository.find({
            select: ["id", "username", "role"] // No passwords
        });

        response.send(users); // Send all the users
    }
    async getOneById(request: Request, response: Response, next: NextFunction) {
        // Get the ID from the url
        const id = request.params.id;

        // Get the user from database
        try {
            const user = await this.userRepository.findOneOrFail(id, {
                select: ["id", "username", "role"] // No passwords
            });
        } catch (error) {
            response.status(404).send("User not found");
        }
    }

    async newUser(request: Request, response: Response, next: NextFunction){
        // Get parameters from the body
        let { username, password, role } = request.body;
        let user = new User();
        user.username = username;
        user.password = password;
        user.role = role;

        //Validade if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            response.status(400).send(errors);
            return;
        }

        //Hash the password, to securely store on DB
        user.hashPassword();

        //Try to save. If fails, the username is already in use
        try {
            await this.userRepository.save(user);
        } catch (e) {
            response.status(409).send("username already in use");
            return;
        }

        //If all ok, send 201 response
        response.status(201).send("User created");
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(userToRemove);
    }

    async editUser(request: Request, response: Response, next: NextFunction) {
        // Get the ID from the url
        const id = request.params.id;

        // Get values from the body
        const { username, role } = request.body;

        // Try to find user on database
        let user;
        try {
            user = await this.userRepository.findOneOrFail(id);
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
            await this.userRepository.save(user);
        } catch (e) {
            response.status(409).send("username already in use"); // Conflict
            return;
        }

        response.status(204).send(); // No content
    }

    async deleteUser(request: Request, response: Response, next: NextFunction) {
        // Get the ID from the url
        const id = request.params.id;

        let user: User;
        try {
            user = await this.userRepository.findOneOrFail(id);
        } catch (error) {
            response.status(404).send("User not found");
            return;
        }
        this.userRepository.delete(id);

        response.status(204).send(); // No content
    }
}
