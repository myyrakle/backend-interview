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
    ForeignKey,
} from "sequelize-typescript";
import { Product } from "./product";
import { User } from "./user";

// 상품 찜 테이블
@Table
export class ProductDibs extends Model {
    @Comment("식별자")
    @PrimaryKey
    @AutoIncrement
    @Column
    id: bigint;

    @Comment("사용자 식별자")
    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    userId: bigint;

    @Comment("상품 식별자")
    @AllowNull(false)
    @ForeignKey(() => Product)
    @Column
    productId: bigint;

    @Comment("사용여부(논리적 삭제)")
    @AllowNull(false)
    @Default(true)
    @Column
    useYn: boolean;
}
