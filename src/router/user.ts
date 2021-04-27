import Router from "express-promise-router";
import { UserController } from "../controllers/user.controller";

export const router = Router();

const controller = new UserController();

router.get("/check-email-duplicated", controller.checkEmailDuplicated);
router.post("/signup", controller.signup);
router.delete("/close-my-account", controller.closeMyAccount);
router.get("/my-info", controller.getMyInto);

module.exports = router;
