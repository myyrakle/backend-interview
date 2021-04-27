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

router.post("/product/review", controller.createReview);
router.put("/product/review/:id", controller.updateReview);
router.get("/product/review/:id", controller.findReview);
router.delete("/product/review/:id", controller.deleteReview);
router.get("/review/review-list", controller.findReviewList);

module.exports = router;
