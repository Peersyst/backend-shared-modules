import { CanActivate, ExecutionContext, Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";

@Injectable()
export class DigestGuard implements CanActivate {
    constructor(@Inject(ConfigService) private configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {
        const { headers, rawBody } = context.switchToHttp().getRequest();
        const secretKey = this.configService.get("sumsub.secretKey");

        const calculatedDigest = crypto
            .createHmac('sha1', secretKey)
            .update(rawBody)
            .digest('hex')

        return calculatedDigest === headers['x-payload-digest'];
    }
}
