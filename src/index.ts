import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";

import {Request, Response} from "express";
import {Routes} from "./routes/routes";
import {User} from "./entity/User";

createConnection().then(async connection => {

    // create express app
    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(route => {
        app[route.method](
            route.route,                                          // Path: something like /users/:id
            (route.handlers === undefined) ? [] : route.handlers, // Handlers: gets called before the function | normally auth
            (req: Request, res: Response, next: Function) => {    // The actual funcion that handles the request
                const result = route.controller[route.action](req, res, next);
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
                } else if (result !== null && result !== undefined) {
                    res.json(result);
                }
            });
    });

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    // insert new users for test
    await connection.manager.save(connection.manager.create(User, {
        firstName: "Timber",
        lastName: "Saw",
        age: 27
    }));
    await connection.manager.save(connection.manager.create(User, {
        firstName: "Phantom",
        lastName: "Assassin",
        age: 24
    }));

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

}).catch(error => console.log(error));
