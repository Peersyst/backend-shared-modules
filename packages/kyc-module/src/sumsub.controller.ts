import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { Controller, Post, Body } from "@nestjs/common";
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiErrorDecorators } from "./exception/error-response.decorator";
import { BusinessException } from "./exception/business.exception";
import { KycErrorCode } from "./exception/error-codes";
import { KycService } from "./kyc.service";
import { ApplicantCreatedRequest } from "./requests/applicant-created.request";
import { ApplicantPendingRequest } from "./requests/applicant-pending.request";
import { ApplicantReviewedRequest } from "./requests/applicant-reviewed.request";
import { ApplicantOnHoldRequest } from "./requests/applicant-on-hold.request";
import { ApplicantPersonalInfoChangedRequest } from "./requests/applicant-personal-info-changed.request";
import { ApplicantPrecheckedRequest } from "./requests/applicant-prechecked.request";
import { ApplicantDeletedRequest } from "./requests/applicant-deleted.request";

@ApiTags("sumsub")
@Controller("kyc")
@ApiErrorDecorators()
export class SumsubController {
    constructor(
        private readonly kycService: KycService,
    ) {}

    @ApiOperation({ summary: "Webhook for sumsub of applicant created" })
    @Post("applicant-created")
    @ApiForbiddenResponse()
    @ApiOkResponse()
    @ApiException(() => new BusinessException(KycErrorCode.USER_NOT_FOUND))
    async applicantCreated(@Body() applicantCreatedRequest: ApplicantCreatedRequest): Promise<void> {
        await this.kycService.create(applicantCreatedRequest.externalUserId, applicantCreatedRequest.applicantId);
    };

    @ApiOperation({ summary: "Webhook for sumsub of applicant pending" })
    @Post("applicant-pending")
    @ApiForbiddenResponse()
    @ApiOkResponse()
    @ApiException(() => new BusinessException(KycErrorCode.KYC_NOT_FOUND))
    @ApiException(() => new BusinessException(KycErrorCode.USER_NOT_FOUND))
    async applicantPending(@Body() applicantPendingRequest: ApplicantPendingRequest): Promise<void> {
        await this.kycService.pending(applicantPendingRequest.applicantId, applicantPendingRequest.reviewStatus);
    };

    @ApiOperation({ summary: "Webhook for sumsub of applicant reviewed" })
    @Post("applicant-reviewed")
    @ApiForbiddenResponse()
    @ApiOkResponse()
    @ApiException(() => new BusinessException(KycErrorCode.KYC_NOT_FOUND))
    @ApiException(() => new BusinessException(KycErrorCode.USER_NOT_FOUND))
    async applicantReviewed(@Body() applicantReviewedRequest: ApplicantReviewedRequest): Promise<void> {
        await this.kycService.reviewed(applicantReviewedRequest.applicantId, applicantReviewedRequest.reviewStatus, applicantReviewedRequest.reviewResult);
    }

    @ApiOperation({ summary: "Webhook for sumsub of applicant on hold" })
    @Post("applicant-on-hold")
    @ApiForbiddenResponse()
    @ApiOkResponse()
    @ApiException(() => new BusinessException(KycErrorCode.KYC_NOT_FOUND))
    async applicantOnHold(@Body() applicantOnHoldRequest: ApplicantOnHoldRequest): Promise<void> {
        await this.kycService.onHold(applicantOnHoldRequest.applicantId, applicantOnHoldRequest.reviewStatus);
    }

    @ApiOperation({ summary: "Webhook for sumsub of applicant personal info changed" })
    @Post("applicant-personal-info-changed")
    @ApiForbiddenResponse()
    @ApiOkResponse()
    @ApiException(() => new BusinessException(KycErrorCode.KYC_NOT_FOUND))
    async applicantPersonalInfoChanged(@Body() applicantPersonalInfoChangedRequest: ApplicantPersonalInfoChangedRequest): Promise<void> {
        await this.kycService.personalInfoChanged(
            applicantPersonalInfoChangedRequest.applicantId,
            applicantPersonalInfoChangedRequest.reviewStatus,
            applicantPersonalInfoChangedRequest.reviewResult.reviewAnswer,
        );
    }

    @ApiOperation({ summary: "Webhook for sumsub of applicant prechecked" })
    @Post("applicant-prechecked")
    @ApiForbiddenResponse()
    @ApiOkResponse()
    async applicantPrechecked(@Body() applicantPrecheckedRequest: ApplicantPrecheckedRequest): Promise<void> {
        await this.kycService.prechecked(applicantPrecheckedRequest.applicantId, applicantPrecheckedRequest.reviewStatus);
    }

    @ApiOperation({ summary: "Webhook for sumsub of applicant deleted" })
    @Post("applicant-deleted")
    @ApiForbiddenResponse()
    @ApiOkResponse()
    async applicantDeleted(@Body() applicantDeletedRequest: ApplicantDeletedRequest): Promise<void> {
        await this.kycService.deleted(applicantDeletedRequest.applicantId, applicantDeletedRequest.reviewStatus);
    }
}
