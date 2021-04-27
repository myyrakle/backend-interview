import { NextFunction, Request, Response } from "express";
import { passwordHashing } from "../lib/password";
import { makeAccessToken, makeRefreshToken } from "../lib/jwt";
import { UserService } from "../services/user.service";
import { RefreshTokenService } from "../services/refresh_token.service";
import { ProductService } from "../services/product.service";
import { ProductDibsService } from "../services/product_dibs.service";
import { ProductReviewService } from "../services/product_review.service";

export class ProductController {
    //상품 생성
    async createOne(req: Request, res: Response, _next: NextFunction) {
        const name = String(req.body.name);
        const description = String(req.body.description);
        const brand = String(req.body.brand);
        const size = String(req.body.size);
        const color = String(req.body.color);

        if (req?.authUser === null) {
            res.status(401).json({
                success: false,
                message: "미인증 거부",
            });
            return;
        }

        if (req?.authUser?.userType !== "ADMIN") {
            res.status(403).json({
                success: false,
                message: "권한 부족",
            });
            return;
        }

        const writerId = BigInt(req.authUser?.id);

        try {
            const productService = new ProductService();

            const product = await productService.createOne({
                writerId,
                name,
                description,
                brand,
                size,
                color,
            });

            res.json({
                success: true,
                productId: product.id,
                message: "성공",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }

    //상품 수정
    async updateOne(req: Request, res: Response, _next: NextFunction) {
        const id = BigInt(Number(req.params.id));
        const name = String(req.body.name);
        const description = String(req.body.description);
        const brand = String(req.body.brand);
        const size = String(req.body.size);
        const color = String(req.body.color);

        if (req?.authUser === null) {
            res.status(401).json({
                success: false,
                message: "미인증 거부",
            });
            return;
        }

        if (req?.authUser?.userType !== "ADMIN") {
            res.status(403).json({
                success: false,
                message: "권한 부족",
            });
            return;
        }

        const writerId = BigInt(req.authUser?.id);

        try {
            const productService = new ProductService();

            await productService.updateOne({
                id,
                writerId,
                name,
                description,
                brand,
                size,
                color,
            });

            res.json({
                success: true,
                message: "성공",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }

    //상품 조회
    async findOne(req: Request, res: Response, _next: NextFunction) {
        const id = BigInt(req.params.id);

        try {
            const productService = new ProductService();

            const product = await productService.findOneById(id);

            res.clearCookie("accessToken").json({
                success: true,
                product: {
                    name: product.name,
                    description: product.description,
                    brand: product.brand,
                    size: product.size,
                    color: product.color,
                },
                message: "성공",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }

    //상품 삭제
    async deleteOne(req: Request, res: Response, _next: NextFunction) {
        const id = BigInt(Number(req.params.id));

        try {
            const productService = new ProductService();

            await productService.deleteOneById(id);

            res.json({
                success: true,
                message: "성공",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }

    //찜(좋아요)
    async dibsOne(req: Request, res: Response, _next: NextFunction) {
        const productId = BigInt(Number(req.params.id));

        if (req?.authUser === null) {
            res.status(401).json({
                success: false,
                message: "미인증 거부",
            });
            return;
        }

        const userId = BigInt(Number(req.authUser?.id));

        try {
            const dibsService = new ProductDibsService();

            await dibsService.createOne(userId, productId);

            res.json({
                success: true,
                message: "성공",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }

    //찜 해제
    async undibsOne(req: Request, res: Response, _next: NextFunction) {
        const productId = BigInt(req.params.id);

        if (req?.authUser === null) {
            res.status(401).json({
                success: false,
                message: "미인증 거부",
            });
            return;
        }

        const userId = BigInt(req.authUser?.id);

        try {
            const dibsService = new ProductDibsService();

            await dibsService.deleteOne(userId, productId);

            res.json({
                success: true,
                message: "성공",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }

    //상품 목록 조회
    async findList(req: Request, res: Response, _next: NextFunction) {
        let order: "dibsCount" | "reviewCount" | "name" | "createdAt";

        switch (String(req.query.order)) {
            case "dibsCount":
                order = "dibsCount";
                break;
            case "reviewCount":
                order = "reviewCount";
                break;
            case "name":
                order = "name";
                break;
            case "createdAt":
                order = "createdAt";
                break;
            default:
                order = "dibsCount";
        }

        const dibs =
            req.query.dibs === undefined ? null : req.query.dibs == "true";
        const searchText = (req.query.searchText as string) ?? null;
        const starMin =
            req.query.starMin === undefined ? null : Number(req.query.starMin);
        const starMax =
            req.query.starMin === undefined ? null : Number(req.query.starMax);
        const brand = (req.query.brand as string) ?? null;
        const asc = req.query.asc === "true";
        const page = req.query.page === undefined ? 1 : Number(req.query.page);
        const limit =
            req.query.limit === undefined ? 10 : Number(req.query.limit);
        const offset = (page - 1) * limit;

        const userId = req.authUser?.id ?? null;

        try {
            const productService = new ProductService();

            const { list, total_count } = await productService.findList({
                order,
                asc,
                limit,
                offset,
                searchText,
                starMin,
                starMax,
                brand,
                userId,
                dibs,
            });

            res.json({
                success: true,
                list,
                total_count,
                message: "성공",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }

    //리뷰 생성
    async createReview(req: Request, res: Response, _next: NextFunction) {
        const productId = BigInt(req.body.productId);
        const star = Number(req.body.star);
        const content = String(req.body.content);

        if (req?.authUser === null) {
            res.status(401).json({
                success: false,
                message: "미인증 거부",
            });
            return;
        }

        const userId = BigInt(req.authUser?.id);

        try {
            const reviewService = new ProductReviewService();

            const review = await reviewService.createOne({
                userId,
                productId,
                star,
                content,
            });

            res.json({
                success: true,
                reviewId: review.id,
                message: "성공",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }

    //리뷰 수정
    async updateReview(req: Request, res: Response, _next: NextFunction) {
        const id = BigInt(req.params.id);
        const star = Number(req.body.star);
        const content = String(req.body.content);

        if (req?.authUser === null) {
            res.status(401).json({
                success: false,
                message: "미인증 거부",
            });
            return;
        }

        if (req?.authUser?.userType !== "ADMIN") {
            res.status(403).json({
                success: false,
                message: "권한 부족",
            });
            return;
        }

        const userId = BigInt(req.authUser?.id);

        try {
            const reviewService = new ProductReviewService();

            await reviewService.updateOne({
                id,
                userId,
                star,
                content,
            });

            res.json({
                success: true,
                message: "성공",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }

    //리뷰 조회
    async findReview(req: Request, res: Response, _next: NextFunction) {
        const id = BigInt(req.params.id);

        try {
            const reviewService = new ProductReviewService();

            const review = await reviewService.findOneById(id);

            res.json({
                success: true,
                review: {
                    name: review.user.name,
                    star: review.star,
                    content: review.content,
                },
                message: "성공",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }

    //리뷰 삭제
    async deleteReview(req: Request, res: Response, _next: NextFunction) {
        const id = BigInt(req.params.id);

        try {
            const reviewService = new ProductReviewService();

            await reviewService.deleteOneById(id);

            res.json({
                success: true,
                message: "성공",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }

    //리뷰 목록 조회
    async findReviewList(req: Request, res: Response, _next: NextFunction) {
        const productId =
            req.query.productId === undefined
                ? null
                : BigInt(req.query.productId);

        const page = req.query.page === undefined ? 1 : Number(req.query.page);
        const limit =
            req.query.limit === undefined ? 10 : Number(req.query.limit);
        const offset = (page - 1) * limit;

        try {
            const reviewService = new ProductReviewService();

            const { list, total_count } = await reviewService.findReviewList({
                limit,
                offset,
                productId,
            });

            res.json({
                success: true,
                list,
                total_count,
                message: "성공",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }
}
