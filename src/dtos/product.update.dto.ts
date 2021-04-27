import { passwordHashing } from "../lib/password";
import { uuid } from "uuidv4";

export class ProductUpdateDto {
    id: bigint;
    writerId: bigint;
    name: string;
    description: string;
    brand: string;
    size: string;
    color: string;
}
