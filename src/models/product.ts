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
import { User } from "./user";

//상품 테이블
@Table
export class Product extends Model {
    @Comment("식별자")
    @PrimaryKey
    @AutoIncrement
    @Column
    id: bigint;

    @Comment("상품 등록자")
    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    writerId: bigint;

    @Comment("상품명")
    @AllowNull(false)
    @Column(DataType.STRING(100))
    name: string;

    @Comment("상품 설명")
    @AllowNull(false)
    @Column(DataType.TEXT)
    description: string;

    @Comment("상품 브랜드")
    @AllowNull(false)
    @Column(DataType.STRING(100))
    brand: string;

    @Comment("상품 사이즈")
    @AllowNull(false)
    @Column(DataType.STRING(100))
    size: string;

    @Comment("상품 색상")
    @AllowNull(false)
    @Column(DataType.STRING(100))
    color: string;

    @Comment("사용여부(논리적 삭제)")
    @AllowNull(false)
    @Default(true)
    @Column
    useYn: boolean;
}
