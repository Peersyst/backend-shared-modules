import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SignatureMiddleware implements NestMiddleware {
    constructor(@Inject(ConfigService) private configService: ConfigService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const secretKey = this.configService.get("sumsub.secretKey");
            const calculatedDigest = crypto
                .createHmac('sha1', secretKey)
                .update((req as any).rawBody)
                .digest('hex');
            if (calculatedDigest !== req.headers['x-payload-digest']) {
                return res.status(403).json({ message: "bad digest" });
            }
        } catch (error) {
            return res.status(500);
        }

        next();
    }
}
