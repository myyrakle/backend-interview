import { ProductReview } from "../models/product_review";
import { ProductDibs } from "../models/product_dibs";
import { User } from "../models/user";
import { ProductReviewCreateDto } from "../dtos/product_review.create.dto";
import { ProductReviewUpdateDto } from "../dtos/product_review.update.dto";
import DB from "../databases/postgres";
import { QueryTypes } from "sequelize";

export class ProductReviewService {
    async createOne(value: ProductReviewCreateDto) {
        const review = new ProductReview({ ...value });
        return await review.save();
    }

    async updateOne(value: ProductReviewUpdateDto) {
        return await ProductReview.update(
            { ...value },
            { where: { id: value.id } }
        );
    }

    async deleteOneById(reviewId: bigint) {
        return await ProductReview.update(
            { useYn: false },
            { where: { id: reviewId } }
        );
    }

    async findOneById(reviewId: bigint) {
        return await ProductReview.findOne({
            where: { id: reviewId },
            include: {
                model: User,
                attributes: ["name"],
            },
        });
    }

    async findReviewList(value: {
        limit: number;
        offset: number;
        productId?: bigint;
    }) {
        const result: any = await DB.connection.query(
            `
            SELECT 
                *
            FROM 
            (
                SELECT 
                    A."id"
                    , A."productId"
                    , A."star"
                    , A."content"
                    , A."createdAt"
                    , B."name"
                    , COUNT(1) OVER() AS TOTAL_COUNT
                FROM "ProductReviews" AS A 
                JOIN "Users" AS B 
                ON 1=1
                    AND A."userId" = B."id"
                    AND A."useYn" IS TRUE
                WHERE 1=1
                    ${
                        value.productId === null
                            ? ""
                            : `AND A."productId" = ${value.productId}`
                    }
            ) A
            ORDER BY A."createdAt" DESC
            OFFSET ${value.offset}
            LIMIT ${value.limit}
        `,
            { type: QueryTypes.SELECT }
        );

        return {
            total_count: result.length === 0 ? 0 : result[0].total_count,
            list: result.map((e) => ({
                id: e.id,
                name: e.name,
                productId: e.productId,
                star: e.star,
                content: e.content,
                createdAt: e.createdAt,
            })),
        };
    }
}
