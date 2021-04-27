import { NextFunction, Request, Response } from "express";
import { passwordHashing } from "../lib/password";
import { makeAccessToken, makeRefreshToken } from "../lib/jwt";
import { UserService } from "../services/user.service";
import { RefreshTokenService } from "../services/refresh_token.service";

export class AuthController {
    async login(req: Request, res: Response, _next: NextFunction) {
        const email = String(req.body.email);
        const password = String(req.body.password);

        try {
            const userService = new UserService();
            const tokenService = new RefreshTokenService();

            const user = await userService.findOneByEmail(email);

            const passwordEqual =
                passwordHashing(password, user?.passwordSalt) ===
                user?.password;

            if (passwordEqual) {
                const userData = { userId: user.id, userType: user.userType };
                const accessToken = makeAccessToken(userData);
                const refreshToken = makeRefreshToken(userData);

                await tokenService.createOne(user.id, refreshToken);

                res.cookie("accessToken", accessToken);

                res.json({
                    success: true,
                    loginFailed: true,
                    refreshToken,
                    message: "성공",
                });
            } else {
                res.json({
                    success: false,
                    loginFailed: true,
                    refreshToken: null,
                    message: "로그인 실패",
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }

    async refresh(req: Request, res: Response, _next: NextFunction) {
        const refreshToken = String(req.body.refreshToken);

        try {
            const userService = new UserService();
            const tokenService = new RefreshTokenService();

            const token = await tokenService.findOneToken(refreshToken);
            const user = await userService.findOneById(token.userId);

            const userData = { userId: user.id, userType: user.userType };
            const accessToken = makeAccessToken(userData);

            res.cookie("accessToken", accessToken);

            res.json({
                success: true,
                refresh_failed: true,
                message: "성공",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }

    async logout(req: Request, res: Response, _next: NextFunction) {
        const refreshToken = String(req.body.refreshToken);

        try {
            const _userService = new UserService();
            const tokenService = new RefreshTokenService();

            await tokenService.deleteOneByToken(refreshToken);

            res.clearCookie("accessToken").json({
                success: true,
                refresh_failed: true,
                message: "성공",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "서버 오류",
                error: JSON.stringify(error),
            });
        }
    }
}
