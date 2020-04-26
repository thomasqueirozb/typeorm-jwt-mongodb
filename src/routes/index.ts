import { Router } from "express";

import AuthRouter from "./AuthRouter";
import UserRouter from "./UserRouter";

/*
All routers are structured like this:

router.get(
    "endpoint",
    [handlers],
    function
);
*/

const routes = Router();

routes.use("/auth", AuthRouter);
routes.use("/user", UserRouter);

export default routes;
