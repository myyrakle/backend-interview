import { NextFunction, Request, Response } from "express";
import { UserCreateDto } from "../dtos/user.create.dto";
import { UserService } from "../services/user.service";

export class UserController {
    async signup(req: Request, res: Response, next: NextFunction) {
        const name = String(req.body.name);
        const email = String(req.body.email);
        const password = String(req.body.password);

        try {
            const userService = new UserService();

            const duplicated = await userService.checkEmailDupilcated(email);

            if (duplicated) {
                res.json({
                    success: false,
                    emailDuplicated: true,
                    message: "이메일 중복됨",
                });
            } else {
                await userService.createOne(
                    new UserCreateDto({
                        name,
                        email,
                        password,
                        userType: "USER",
                    })
                );
                res.json({
                    success: true,
                    emailDuplicated: false,
                    message: "성공",
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

    async checkEmailDuplicated(
        req: Request,
        res: Response,
        _next: NextFunction
    ) {
        const email = String(req.body.email);

        try {
            const userService = new UserService();

            const duplicated = await userService.checkEmailDupilcated(email);

            res.json({
                success: true,
                emailDuplicated: duplicated,
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

    // 회원 탈퇴
    async closeMyAccount(req: Request, res: Response, nest: NextFunction) {
        try {
            const userService = new UserService();

            if (req.authUser === null) {
                res.status(401).json({
                    success: false,
                    message: "미인증 거부",
                });
                return;
            }

            await userService.deleteOneById(req.authUser?.id);

            res.json({
                success: true,
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

    async getMyInto(req: Request, res: Response, nest: NextFunction) {
        try {
            const userService = new UserService();

            if (req.authUser === null) {
                res.status(401).json({
                    success: false,
                    message: "미인증 거부",
                });
                return;
            }

            res.json({
                success: true,
                user: {
                    id: req.authUser?.id,
                    email: req.authUser?.email,
                    name: req.authUser?.name,
                    createdAt: req.authUser?.createdAt,
                    userType: req.authUser?.userType,
                },
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
