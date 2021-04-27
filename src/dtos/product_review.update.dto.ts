import { passwordHashing } from "../lib/password";
import { uuid } from "uuidv4";

export class ProductReviewUpdateDto {
    id: bigint;
    userId: bigint;
    star: number;
    content: string;
}
