import Router from "express-promise-router";
import { ProductController } from "../controllers/product.controller";

export const router = Router();

const controller = new ProductController();

router.post("/product", controller.createOne);
router.get("/product/:id", controller.findOne);
router.put("/product/:id", controller.updateOne);
router.delete("/product/:id", controller.deleteOne);
router.post("/product/:id/dibs", controller.dibsOne);
router.delete("/product/:id/dibs", controller.undibsOne);
router.get("/product-list", controller.findList);

router.post("/review", controller.createReview);
router.put("/review/:id", controller.updateReview);
router.get("/review/:id", controller.findReview);
router.delete("/review/:id", controller.deleteReview);
router.get("/review-list", controller.findReviewList);

module.exports = router;
