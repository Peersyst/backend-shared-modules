import { Inject, Injectable } from "@nestjs/common";
import { BusinessException } from "./exception/business.exception";
import { KycErrorCode } from "./exception/error-codes";
import { KycAnswer, KycStatus, SimplifiedKycI } from "./dto/kyc.dto";
import { KycTokenDtoI } from "./dto/kyc-token.dto";
import { SumsubService } from "./sumsub.service";

export interface KycUserServiceI {
    findById: (userId: number) => Promise<any>;
}

@Injectable()
export class KycService {
    constructor(
        @Inject("UserService") private readonly userService: KycUserServiceI,
        private readonly sumsubService: SumsubService,
    ) {}

    async getSimplifiedKyc(userId: number): Promise<SimplifiedKycI> {
        return {
            userId,
            status: KycStatus.COMPLETED,
            reviewAnswer: KycAnswer.GREEN,
            passed: true,
            updatedAt: new Date(),
        };
    }

    async getToken(userId: number): Promise<KycTokenDtoI> {
        const user = await this.userService.findById(userId);
        const accessToken = await this.sumsubService.generateAccessToken(user.kycId);
        return { accessToken };
    }

    // TODO: remove. For testing purposes only
    async simulateSuccess(userId: number): Promise<void> {
        const kyc = await this.kycRepository.findByUserId(userId);
        if (!kyc) {
            throw new BusinessException(KycErrorCode.KYC_NOT_FOUND);
        }
        await this.sumsubService.simulateGreenReview(kyc.applicantId);
    }

    // TODO: remove. For testing purposes only
    async simulateFailure(userId: number): Promise<void> {
        const kyc = await this.kycRepository.findByUserId(userId);
        if (!kyc) {
            throw new BusinessException(KycErrorCode.KYC_NOT_FOUND);
        }
        await this.sumsubService.simulateRedReview(kyc.applicantId);
    }
}
