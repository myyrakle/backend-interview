import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { checkToken } from "../lib/jwt";

export async function authMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    try {
        const accessToken = req.cookies.accessToken;
        console.log(">>>> 토큰");
        console.log(accessToken);

        const result: any = checkToken(accessToken);

        const userService = new UserService();

        const user = await userService.findOneById(result.userId);

        if (user === null) {
            throw 0;
        }

        req.authUser = user;

        console.log("!!!! 인증 성공");
        next();
    } catch {
        req.authUser = null;
        console.log("!!!! 인증 실패");
        next();
    }
}
