import { Router } from "express";
import UserController from "../controllers/UserController";
import checkJwt from "../middlewares/checkJwt";
import checkRole from "../middlewares/checkRole";

const router = Router();

// Get all users
router.get(
    "/",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.listAll
);

// Create a new user
router.post(
    "/",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.newUser
);

// Get one user
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.getOneById
);


// Edit one user
router.patch(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.editUser
);

// Delete one user
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.deleteUser
);

export default router;
