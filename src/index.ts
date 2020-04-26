import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";

import {Request, Response} from "express";
import routes from "./routes";
import User from "./entity/User";
import {port} from "./config";


createConnection().then(async connection => {

    // create express app
    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use("/", routes);

    // start express server
    app.listen(port, () => {
        console.log("Server started on port", port);
    });
}).catch(error => console.log(error));
