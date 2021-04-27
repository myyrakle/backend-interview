import DB from "../databases/postgres";
import { UserCreateDto } from "../dtos/user.create.dto";
import { User } from "../models/user";

export class UserService {
    async deleteOneById(id: bigint) {
        return await User.update({ userStatus: id }, { where: { id } });
    }

    async createOne(value: UserCreateDto) {
        const user = new User({ ...value });
        return await user.save();
    }

    async checkEmailDupilcated(email: string) {
        const user = await User.findOne({ where: { email } });
        return user !== null;
    }

    async findOneByEmail(email: string) {
        return await User.findOne({ where: { email, userStatus: 0 } });
    }

    async findOneById(id: bigint) {
        return await User.findOne({ where: { id } });
    }
}
