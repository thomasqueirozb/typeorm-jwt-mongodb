import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import * as dotenv from "dotenv";

import {Request, Response} from "express";
import routes from "./routes";
import User from "./entity/User";

const dotenv_result = dotenv.config();
if (dotenv_result.error) {
    throw dotenv_result.error;
}
// console.log("env", dotenv_result.parsed); // This shows all loaded environment variables

createConnection().then(async connection => {

    // create express app
    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    app.use("/", routes);

    // start express server
    const port = process.env.port || 3000;
    app.listen(port, () => {
        console.log("Server started on port", port);
    });
}).catch(error => console.log(error));
