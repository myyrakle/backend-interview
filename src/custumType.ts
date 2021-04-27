// ./src/customType/express.d.ts
import { User } from "./models/User";

declare global {
    namespace Express {
        interface Request {
            authUser?: User;
        }
    }
}
