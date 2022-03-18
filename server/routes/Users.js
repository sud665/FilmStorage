const express = require("express");
const usersRouter = express.Router();

const { usersController } = require("../controller");

usersRouter.post("/signup", usersController.signup.post);
usersRouter.post("/signin", usersController.signin.post);
usersRouter.post("/signout", usersController.signout.post);
usersRouter.patch("/update", usersController.update.patch);
usersRouter.delete("/withdrawal", usersController.withdrawal.delete);
usersRouter.get("/auth/:user_id", usersController.auth.get);

module.exports = usersRouter;
