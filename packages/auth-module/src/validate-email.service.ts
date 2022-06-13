import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VerifyEmailTokenDTO } from "./dto/verify-email-token.dto";
import { VerifyEmailToken } from "./entities/VerifyEmailToken";
import { BusinessException } from "./exception/business.exception";
import { AuthErrorCode } from "./exception/error-codes";
import { randomString } from "./utils/random";

@Injectable()
export class ValidateEmailService {
    constructor(
        @InjectRepository(VerifyEmailToken) private readonly verifyEmailTokenRepository: Repository<VerifyEmailToken>,
    ) {}

    async createEmailVerificationToken(userId: number): Promise<string> {
        const token = randomString(16);
        await this.verifyEmailTokenRepository.delete({ userId });
        await this.verifyEmailTokenRepository.save({ userId, token });
        return token;
    }

    async verifyEmailVerificationToken(token: string): Promise<VerifyEmailTokenDTO> {
        const tokenEntity = await this.verifyEmailTokenRepository.findOne({ where: { token } });
        if (!tokenEntity) {
            throw new BusinessException(AuthErrorCode.TOKEN_NOT_FOUND);
        } else if (tokenEntity.verified) {
            throw new BusinessException(AuthErrorCode.TOKEN_ALREADY_VERIFIED);
        }
        tokenEntity.verified = true;
        await this.verifyEmailTokenRepository.save(tokenEntity);
        return VerifyEmailTokenDTO.fromEntity(tokenEntity);
    }
}
