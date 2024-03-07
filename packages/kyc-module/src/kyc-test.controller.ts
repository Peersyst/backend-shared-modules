import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { Controller, Request, Post } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiErrorDecorators } from "./exception/error-response.decorator";
import { KycBusinessException } from "./exception/business.exception";
import { KycErrorCode } from "./exception/error-codes";
import { KycService } from "./kyc.service";
import { Authenticated } from "@peersyst/auth-module";

@ApiTags("kyc-test")
@Controller("kyc-test")
@ApiErrorDecorators()
export class KycTestController {
    constructor(private readonly kycService: KycService) {}

    @ApiOperation({ summary: "Simulate kyc success" })
    @Authenticated()
    @Post("success")
    @ApiException(() => new KycBusinessException(KycErrorCode.KYC_NOT_FOUND))
    @ApiException(() => new KycBusinessException(KycErrorCode.SUMSUB_REQUEST_ERROR))
    @ApiOkResponse()
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async simulateSuccess(@Request() req): Promise<void> {
        await this.kycService.simulateSuccess(req.user.id);
    }

    @ApiOperation({ summary: "Simulate kyc failure" })
    @Authenticated()
    @Post("failure")
    @ApiException(() => new KycBusinessException(KycErrorCode.KYC_NOT_FOUND))
    @ApiException(() => new KycBusinessException(KycErrorCode.SUMSUB_REQUEST_ERROR))
    @ApiOkResponse()
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async simulateFailure(@Request() req): Promise<void> {
        await this.kycService.simulateFailure(req.user.id);
    }
}
