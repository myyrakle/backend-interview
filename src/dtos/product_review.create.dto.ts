import { passwordHashing } from "../lib/password";
import { uuid } from "uuidv4";

export class ProductReviewCreateDto {
    userId: bigint;
    productId: bigint;
    star: number;
    content: string;
}
