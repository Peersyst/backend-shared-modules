import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { Controller, Request, Post } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { KycTokenDto } from "./dto/kyc-token.dto";
import { ApiErrorDecorators } from "./exception/error-response.decorator";
import { BusinessException } from "./exception/business.exception";
import { KycErrorCode } from "./exception/error-codes";
import { KycService } from "./kyc.service";
import { SimplifiedKyc } from "./dto/kyc.dto";
// import {
//     ApplicantCreatedDTO,
//     ApplicantPendingDTO,
//     ApplicantReviewedDTO,
//     ApplicantOnHoldDTO,
//     ApplicantPersonalInfoChangedDTO,
//     ApplicantPrecheckedDTO,
//     ApplicantDeletedDTO,
// } from "./dto/sumsub.dto";

@ApiTags("sumsub")
@Controller("kyc")
@ApiErrorDecorators()
export class SumsubController {
    constructor(
        private readonly kycService: KycService,
    ) {}

    @ApiOperation({ summary: "Applicant created" })
    @Post("applicant-created")
    @ApiOkResponse()
    async applicantCreated(req: Request, res: Response): Promise<void> {
        await this.kycService.create(req.body as ApplicantCreatedDTO);
    };

    @ApiOperation({ summary: "Applicant created" })
    @Post("applicant-pending")
    @ApiOkResponse()
    async applicantPending(req: Request, res: Response): Promise<void> {
        await this.kycService.pending(req.body as ApplicantPendingDTO);
    };

    @ApiOperation({ summary: "Applicant created" })
    @Post("applicant-reviewed")
    @ApiOkResponse()
    async applicantReviewed(req: Request, res: Response): Promise<void> {
        await this.kycService.reviewed(req.body as ApplicantReviewedDTO);
    }

    @ApiOperation({ summary: "Applicant created" })
    @Post("applicant-on-hold")
    @ApiOkResponse()
    async applicantOnHold(req: Request, res: Response): Promise<void> {
        await this.kycService.onHold(req.body as ApplicantOnHoldDTO);
    }

    @ApiOperation({ summary: "Applicant created" })
    @Post("applicant-personal-info-changed")
    @ApiOkResponse()
    async applicantPersonalInfoChanged(req: Request, res: Response): Promise<void> {
        await this.kycService.personalInfoChanged(req.body as ApplicantPersonalInfoChangedDTO);
    }

    @ApiOperation({ summary: "Applicant created" })
    @Post("applicant-prechecked")
    @ApiOkResponse()
    async applicantPrechecked(req: Request, res: Response): Promise<void> {
        await this.kycService.prechecked(req.body as ApplicantPrecheckedDTO);
    }

    @ApiOperation({ summary: "Applicant created" })
    @Post("applicant-deleted")
    @ApiOkResponse()
    async applicantDeleted(req: Request, res: Response): Promise<void> {
        await this.kycService.deleted(req.body as ApplicantDeletedDTO);
    }
}
