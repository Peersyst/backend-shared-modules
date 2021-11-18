import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger: Logger;

    constructor(private readonly authService: AuthService) {
        super({ usernameField: "email" });
        this.logger = new Logger(LocalStrategy.name);
    }

    async validate(email: string, password: string): Promise<any> {
        this.logger.log(email);
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException("Credencials incorrectes");
        }
        return user;
    }
}
