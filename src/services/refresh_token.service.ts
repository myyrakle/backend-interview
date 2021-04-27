import { User } from "../models/user";
import { UserCreateDto } from "../dtos/user.create.dto";
import { RefreshToken } from "../models/refresh_token";

export class RefreshTokenService {
    async createOne(userId: bigint, token: string) {
        const refreshToken = new RefreshToken({ userId, tokenValue: token });
        return await refreshToken.save();
    }

    async deleteOneByToken(token: string) {
        return await RefreshToken.update(
            { useYn: false },
            { where: { tokenValue: token } }
        );
    }

    async findOneToken(token: string) {
        return await RefreshToken.findOne({ where: { tokenValue: token } });
    }
}
