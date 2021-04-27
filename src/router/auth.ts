import Router from "express-promise-router";
import { AuthController } from "../controllers/auth.controller";
import { UserController } from "../controllers/user.controller";

export const router = Router();

const controller = new AuthController();

router.post("/login", controller.login);
router.put("/refresh", controller.refresh);
router.delete("/logout", controller.logout);

module.exports = router;
