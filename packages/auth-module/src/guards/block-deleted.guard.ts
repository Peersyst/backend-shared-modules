import { CanActivate, ExecutionContext, Injectable, Inject } from "@nestjs/common";
import { Response } from "express";
import { AuthUserServiceI } from "../auth.service";

@Injectable()
export class BlockDeletedGuard implements CanActivate {
    constructor(@Inject("UserService") private readonly userService: AuthUserServiceI) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { user } = request;
        if (!user) {
            return false;
        }

        try {
            const privateUser = await this.userService.findById(user.id);
            if (!privateUser) {
                request.deleted = true;
                return true;
            }

            return !privateUser.blocked;
        } catch (err) {
            request.deleted = true;
            return true;
        }
    }
}
