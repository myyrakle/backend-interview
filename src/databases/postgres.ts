import config from "config";
import { Sequelize } from "sequelize-typescript";
import { RefreshToken } from "../models/refresh_token";
import { User } from "../models/user";

const sequelize = new Sequelize(process.env.SHOP_DATABASE_URL);
sequelize.authenticate();

sequelize.addModels([User, RefreshToken]);

sequelize.sync({ force: true });

const DB = {
    User,
    RefreshToken,
    sequelize, // connection instance (RAW queries)
    Sequelize, // library
};

export default DB;
