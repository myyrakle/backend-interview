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
export class Product extends Model {
    @Comment("식별자")
    @PrimaryKey
    @AutoIncrement
    @Column
    id: bigint;

    @Comment("상품명")
    @AllowNull(false)
    @Column
    name: string;

    @Comment("상품 설명")
    @AllowNull(false)
    @Column
    description: string;

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
