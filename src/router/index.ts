import Router from "express-promise-router";
import { authMiddleware } from "../middleware/auth.middleware";

export const router = Router();

router.use(authMiddleware);

router.use("/user", require("./user"));
router.use("/auth", require("./auth"));
router.use("/product", require("./product"));
//router.use("/user", require("./user"));

module.exports = router;
