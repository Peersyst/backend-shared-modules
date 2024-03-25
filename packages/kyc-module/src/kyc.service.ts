import { Inject, Injectable } from "@nestjs/common";
import { KycBusinessException } from "./exception/business.exception";
import { KycErrorCode } from "./exception/error-codes";
import { KycAnswer, KycStatus, SimplifiedKycI, KycI } from "./dto/kyc.dto";
import { KycTokenDtoI } from "./dto/kyc-token.dto";
import { SumsubService } from "./sumsub.service";
import { ReviewResultProp } from "./requests/applicant-reviewed.request";

export interface KycRepositoryInterface {
    create: (userId: number, applicantId: string) => Promise<KycI>;
    findByUserId: (userId: number) => Promise<KycI>;
    findByUserIdSimplified: (userId: number) => Promise<SimplifiedKycI>;
    findByApplicantId: (applicantId: string) => Promise<KycI>;
    update: (id: number, updateData: Partial<KycI>) => Promise<void>;
    getKycExternalId: (userId: number) => Promise<string>;
}

@Injectable()
export class KycService {
    constructor(
        @Inject("KycRepository") private readonly kycRepository: KycRepositoryInterface,
        private readonly sumsubService: SumsubService,
    ) {}

    private async getKycByUserId(userId: number): Promise<KycI> {
        const kyc = await this.kycRepository.findByUserId(userId);

        if (!kyc) throw new KycBusinessException(KycErrorCode.KYC_NOT_FOUND);

        return kyc;
    }

    private async getKycByApplicantId(applicantId: string): Promise<KycI> {
        const kyc = await this.kycRepository.findByApplicantId(applicantId);

        if (!kyc) throw new KycBusinessException(KycErrorCode.KYC_NOT_FOUND);

        return kyc;
    }

    async getKyc(userId: number): Promise<KycI> {
        return this.getKycByUserId(userId);
    }

    async getSimplifiedKyc(userId: number): Promise<SimplifiedKycI> {
        const simplifiedKyc = await this.kycRepository.findByUserIdSimplified(userId);

        if (!simplifiedKyc) throw new KycBusinessException(KycErrorCode.KYC_NOT_FOUND);

        return simplifiedKyc;
    }

    async getToken(userId: number): Promise<KycTokenDtoI> {
        const externalId = await this.kycRepository.getKycExternalId(userId);
        const accessToken = await this.sumsubService.generateAccessToken(externalId);
        return { accessToken };
    }

    async simulateSuccess(userId: number): Promise<void> {
        const kyc = await this.getKycByUserId(userId);

        await this.sumsubService.simulateGreenReview(kyc.applicantId);
    }

    async simulateFailure(userId: number): Promise<void> {
        const kyc = await this.getKycByUserId(userId);

        await this.sumsubService.simulateRedReview(kyc.applicantId);
    }

    // ----------------------------------------------------------------------
    // Webhook functions
    // ----------------------------------------------------------------------
    async create(externalUserId: string, applicantId: string): Promise<void> {
        const kyc = await this.kycRepository.findByUserId(Number(externalUserId));

        if (!kyc) await this.kycRepository.create(Number(externalUserId), applicantId);
    }

    async pending(applicantId: string, reviewStatus: KycStatus) {
        const kyc = await this.getKycByApplicantId(applicantId);

        await this.kycRepository.update(kyc.id, { status: reviewStatus });
    }

    async reviewed(applicantId: string, reviewStatus: KycStatus, reviewResult: ReviewResultProp) {
        const kyc = await this.getKycByApplicantId(applicantId);

        if (reviewResult.reviewAnswer === KycAnswer.GREEN) {
            await this.kycRepository.update(kyc.id, { status: reviewStatus, reviewAnswer: KycAnswer.GREEN });
        } else {
            await this.kycRepository.update(kyc.id, {
                status: reviewStatus,
                reviewAnswer: KycAnswer.GREEN,
                moderationComment: reviewResult.moderationComment,
                clientComment: reviewResult.clientComment,
                rejectLabels: reviewResult.rejectLabels,
                reviewRejectType: reviewResult.reviewRejectType,
            });
        }
    }

    async onHold(applicantId: string, reviewStatus: KycStatus) {
        const kyc = await this.getKycByApplicantId(applicantId);

        await this.kycRepository.update(kyc.id, { status: reviewStatus });
    }

    async personalInfoChanged(applicantId: string, reviewStatus: KycStatus, reviewAnswer: KycAnswer) {
        const kyc = await this.getKycByApplicantId(applicantId);

        await this.kycRepository.update(kyc.id, { status: reviewStatus, reviewAnswer });
    }

    async prechecked(applicantId: string, reviewStatus: KycStatus) {
        const kyc = await this.getKycByApplicantId(applicantId);

        await this.kycRepository.update(kyc.id, { status: reviewStatus });
    }

    async deleted(applicantId: string, reviewStatus: KycStatus) {
        const kyc = await this.getKycByApplicantId(applicantId);

        await this.kycRepository.update(kyc.id, { status: reviewStatus, reviewAnswer: KycAnswer.GREEN });
    }
}
