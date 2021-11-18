import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handleRequest(err: any, user: any) {
        return user;
    }
}
