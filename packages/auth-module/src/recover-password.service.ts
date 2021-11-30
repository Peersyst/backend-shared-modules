import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ResetToken } from "./entities/ResetToken";
import { BusinessException } from "./exception/business.exception";
import { AuthErrorCode } from "./exception/error-codes";
import { randomString } from "./utils/random";

@Injectable()
export class RecoverPasswordService {
    private static RESET_EXPIRATION = 600000; // 10 min expiration

    constructor(
        @InjectRepository(ResetToken) private readonly resetTokenRepository: Repository<ResetToken>,
    ) {}

    async createResetToken(userId: number): Promise<string> {
        const token = randomString(10);
        await this.resetTokenRepository.delete({ userId });
        await this.resetTokenRepository.save({
            userId,
            token,
            expiration: new Date(Date.now() + RecoverPasswordService.RESET_EXPIRATION),
        });
        return token;
    }

    async verifyResetToken(token: string): Promise<number> {
        const tokenEntity = await this.resetTokenRepository.findOne({ where: { token } });
        if (!tokenEntity) {
            throw new BusinessException(AuthErrorCode.TOKEN_NOT_FOUND);
        } else if (tokenEntity.expiration < new Date()) {
            throw new BusinessException(AuthErrorCode.TOKEN_EXPIRED);
        }
        return tokenEntity.userId;
    }
}
