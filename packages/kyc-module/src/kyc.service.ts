import { Inject, Injectable } from "@nestjs/common";
import { BusinessException } from "./exception/business.exception";
import { KycErrorCode } from "./exception/error-codes";
import { KycAnswer, KycStatus, SimplifiedKycI, KycI, KycRejectType } from "./dto/kyc.dto";
import { KycTokenDtoI } from "./dto/kyc-token.dto";
import { SumsubService } from "./sumsub.service";
import { ReviewResultProp } from "./requests/applicant-reviewed.request";

export interface KycUserServiceI {
    findById: (userId: number) => Promise<any>;
    findByExternalId: (externalId: string) => Promise<any>;
    getKycExternalId: (userId: number) => Promise<string>;
    assignKyc: (userId: number, kyc: KycI) => Promise<any>;
}

export interface KycNotificationInterface {
    sendKycPendingNotification: (email: string) => Promise<void>;
    sendKycPassedNotification: (email: string) => Promise<void>;
    sendKycRetryNotification: (email: string, moderationComment: string) => Promise<void>;
}

export interface KycRepositoryInterface {
    create: (userId: number, applicantId: string) => Promise<KycI>;
    findByUserId: (userId: number) => Promise<KycI>;
    findByApplicantId: (applicantId: string) => Promise<KycI>;
    update: (id: number, updateData: Partial<KycI>) => Promise<void>;
}

@Injectable()
export class KycService {
    constructor(
        @Inject("UserService") private readonly userService: KycUserServiceI,
        @Inject("KycRepository") private readonly kycRepository: KycRepositoryInterface,
        @Inject("NotificationInterface") private readonly notificationService: KycNotificationInterface,
        private readonly sumsubService: SumsubService,
    ) {}

    async getKyc(userId: number): Promise<KycI> {
        return {
            id: 1,
            applicantId: "hola",
            userId,
            status: KycStatus.COMPLETED,
            reviewAnswer: KycAnswer.GREEN,
            passed: true,
            updatedAt: new Date(),
        };
    }

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
        const externalId = await this.userService.getKycExternalId(userId);
        const accessToken = await this.sumsubService.generateAccessToken(externalId);
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

    // ----------------------------------------------------------------------
    // Webhook functions
    // ----------------------------------------------------------------------
    async create(externalUserId: string, applicantId: string): Promise<void> {
        const user = await this.userService.findByExternalId(externalUserId);
        if (!user) {
            throw new BusinessException(KycErrorCode.USER_NOT_FOUND);
        }

        const kyc = await this.kycRepository.create(user.id, applicantId);
        await this.userService.assignKyc(user.id, kyc);
    }

    async pending(applicantId: string, reviewStatus: KycStatus) {
        const kyc = await this.kycRepository.findByApplicantId(applicantId);
        if (!kyc) {
            throw new BusinessException(KycErrorCode.KYC_NOT_FOUND);
        }
        const user = await this.userService.findById(kyc.userId);
        if (!user) {
            throw new BusinessException(KycErrorCode.USER_NOT_FOUND);
        }

        await this.kycRepository.update(kyc.id, { status: reviewStatus });
        await this.notificationService.sendKycPendingNotification(user.email);
    }

    async reviewed (applicantId: string, reviewStatus: KycStatus, reviewResult: ReviewResultProp) {
        const kyc = await this.kycRepository.findByApplicantId(applicantId);
        if (!kyc) {
            throw new BusinessException(KycErrorCode.KYC_NOT_FOUND);
        }
        const user = await this.userService.findById(kyc.userId);
        if (!user) {
            throw new BusinessException(KycErrorCode.USER_NOT_FOUND);
        }

        if (reviewResult.reviewAnswer === KycAnswer.GREEN) {
            await this.kycRepository.update(kyc.id, { status: reviewStatus, reviewAnswer: KycAnswer.GREEN });
            await this.notificationService.sendKycPassedNotification(user.email);
        } else {
            await this.kycRepository.update(kyc.id, {
                status: reviewStatus,
                reviewAnswer: KycAnswer.GREEN,
                moderationComment: reviewResult.moderationComment,
                clientComment: reviewResult.clientComment,
                rejectLabels: reviewResult.rejectLabels,
                reviewRejectType: reviewResult.reviewRejectType
            });
            if (reviewResult.reviewRejectType === KycRejectType.RETRY) {
                await this.notificationService.sendKycRetryNotification(user.email, reviewResult.moderationComment);
            }
        }
    }

    async onHold(applicantId: string, reviewStatus: KycStatus) {
        const kyc = await this.kycRepository.findByApplicantId(applicantId);
        if (!kyc) {
            throw new BusinessException(KycErrorCode.KYC_NOT_FOUND);
        }
        await this.kycRepository.update(kyc.id, { status: reviewStatus });
    }

    async personalInfoChanged(applicantId: string, reviewStatus: KycStatus, reviewAnswer: KycAnswer) {
        const kyc = await this.kycRepository.findByApplicantId(applicantId);
        if (!kyc) {
            throw new BusinessException(KycErrorCode.KYC_NOT_FOUND);
        }
        await this.kycRepository.update(kyc.id, { status: reviewStatus, reviewAnswer });
    }

    async prechecked(applicantId: string, reviewStatus: KycStatus) {
        const kyc = await this.kycRepository.findByApplicantId(applicantId);
        if (!kyc) {
            throw new BusinessException(KycErrorCode.KYC_NOT_FOUND);
        }
        await this.kycRepository.update(kyc.id, { status: reviewStatus });
    }

    async deleted(applicantId: string, reviewStatus: KycStatus) {
        const kyc = await this.kycRepository.findByApplicantId(applicantId);
        if (!kyc) {
            throw new BusinessException(KycErrorCode.KYC_NOT_FOUND);
        }
        await this.kycRepository.update(kyc.id, { status: reviewStatus, reviewAnswer: KycAnswer.GREEN });
    }
}
