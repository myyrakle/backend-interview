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
    BelongsTo,
} from "sequelize-typescript";
import { Product } from "./product";
import { User } from "./user";

//상품 리뷰 테이블
@Table
export class ProductReview extends Model {
    @Comment("식별자")
    @PrimaryKey
    @AutoIncrement
    @Column
    id: bigint;

    @Comment("리뷰 작성자")
    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    userId: bigint;

    @Comment("상품 식별자")
    @AllowNull(false)
    @ForeignKey(() => Product)
    @Column
    productId: bigint;

    @Comment("별 개수")
    @AllowNull(false)
    @Column(DataType.INTEGER)
    star: number;

    @Comment("리뷰 내용")
    @AllowNull(false)
    @Column(DataType.TEXT)
    content: string;

    @Comment("사용여부(논리적 삭제)")
    @AllowNull(false)
    @Default(true)
    @Column
    useYn: boolean;

    @BelongsTo(() => User)
    user: User;
}
