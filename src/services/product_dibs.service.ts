import { ProductDibs } from "../models/product_dibs";

export class ProductDibsService {
    async createOne(userId: bigint, productId: bigint) {
        const exists = await ProductDibs.findOne({
            where: { userId, productId },
        });

        if (exists) {
            await ProductDibs.update(
                { useYn: true },
                { where: { userId, productId } }
            );
        } else {
            const dibs = new ProductDibs({ userId, productId });
            await dibs.save();
        }

        return;
    }

    async deleteOne(userId: bigint, productId: bigint) {
        await ProductDibs.update(
            { useYn: false },
            { where: { userId, productId } }
        );

        return;
    }
}
