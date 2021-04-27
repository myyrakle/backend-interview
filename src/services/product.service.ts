import { ProductCreateDto } from "../dtos/product.create.dto";
import DB from "../databases/postgres";
import { Product } from "../models/product";
import { ProductUpdateDto } from "../dtos/product.update.dto";
import { ProductDibs } from "../models/product_dibs";
import { QueryTypes } from "sequelize";
import { postgresStringEscape } from "../lib/postgres_escape";

export class ProductService {
    async deleteOneById(id: bigint) {
        return await Product.update({ useYn: false }, { where: { id } });
    }

    async createOne(value: ProductCreateDto) {
        const product = new Product({ ...value });
        return await product.save();
    }

    async updateOne(value: ProductUpdateDto) {
        return await Product.update(
            { ...value },
            { where: { id: value.id, useYn: true } }
        );
    }

    async findOneById(id: bigint) {
        return await Product.findOne({ where: { id, useYn: true } });
    }

    async findList(value: {
        dibs?: boolean;
        userId?: bigint;
        searchText?: string;
        starMin?: number;
        starMax?: number;
        brand?: string;
        order: "dibsCount" | "reviewCount" | "name" | "createdAt";
        asc: boolean;
        limit: number;
        offset: number;
    }) {
        const result: any = await DB.connection.query(
            `
            SELECT 
                *
            FROM 
            (
                SELECT 
                    *
                    , COUNT(1) OVER() AS TOTAL_COUNT
                FROM 
                (
                    SELECT 
                        A."id"
                        , A."name"
                        , A."description"
                        , A."brand"
                        , A."dibsCount"
                        , A."createdAt"
                        , A."dibsYn"
                        , COUNT(B."id") AS "reviewCount"
                        , AVG(B."star") AS "starAverage"
                    FROM 
                    (
                        SELECT  
                            A."id"
                            , A."name"
                            , A."description"
                            , A."brand"
                            , A."createdAt"
                            , COUNT(B."id") AS "dibsCount"
                            , COALESCE(C."useYn", FALSE) AS "dibsYn"
                        FROM "Products" AS A 
                        LEFT JOIN "ProductDibs" AS B 
                        ON 1=1
                            AND A."id" = B."productId"
                            AND B."useYn" IS TRUE
                        LEFT JOIN "ProductDibs" AS C 
                        ON 1=1
                            AND A."id" = C."productId"
                            AND C."userId" = ${value.userId ?? 0}
                        GROUP BY 
                            A."id"
                            , A."name"
                            , A."description"
                            , A."brand"
                            , A."createdAt"
                            , C."id"
                    ) AS A
                    LEFT JOIN "ProductReviews" B 
                    ON 1=1
                        AND A."id" = B."productId"
                        AND B."useYn" IS TRUE
                    GROUP BY 
                        A."id"
                        , A."name"
                        , A."description"
                        , A."brand"
                        , A."dibsCount"
                        , A."createdAt"
                        , A."dibsYn"
                ) A
                WHERE 1=1
                    ${
                        value.starMin === null
                            ? ""
                            : `AND A."starAverage" >= ${value.starMin}`
                    }
                    ${
                        value.starMax === null
                            ? ""
                            : `AND A."starAverage" <= ${value.starMax}`
                    }
                    ${
                        value.brand === null
                            ? ""
                            : `AND A."brand" = '${postgresStringEscape(
                                  value.brand
                              )}'`
                    }
                    ${
                        value.searchText === null
                            ? ""
                            : `AND (
                                A."name" LIKE '%' || ${postgresStringEscape(
                                    value.searchText
                                )}
                                OR 
                                A."description" LIKE '%' || ${postgresStringEscape(
                                    value.searchText
                                )}
                            )`
                    }
                    ${
                        value.dibs === null
                            ? ""
                            : `AND A."dibsYn" = ${value.dibs}`
                    }
            ) A
            ORDER BY A."${value.order}"
            ${value.asc ? "ASC" : "DESC"}
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
                description: e.description,
                createdAt: e.createdAt,
                dibsCount: e.dibsCount,
                reviewCount: e.reviewCount,
                starAverage: e.starAverage,
                dibsYn: e.dibsYn,
            })),
        };
    }
}
