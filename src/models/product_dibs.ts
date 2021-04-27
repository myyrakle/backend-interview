import { BindOptions } from "node:dgram";
import {
    Table,
    Column,
    Model,
    Unique,
    Comment,
    DataType,
    Default,
    AllowNull,
    PrimaryKey,
    AutoIncrement,
} from "sequelize-typescript";

@Table
export class ProductDibs extends Model {
    @Comment("식별자")
    @PrimaryKey
    @AutoIncrement
    @Column
    id: bigint;

    @Comment("사용자 식별자")
    @AllowNull(false)
    @Column
    userId: bigint;

    @Comment("상품 식별자")
    @AllowNull(false)
    @Column
    productId: bigint;

    @Comment("상품 브랜드")
    @AllowNull(false)
    @Column
    brand: string;

    @Comment("상품 사이즈")
    @AllowNull(false)
    @Column
    size: string;

    @Comment("상품 색상")
    @AllowNull(false)
    @Column
    color: string;
}
