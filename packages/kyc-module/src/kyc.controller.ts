import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { Controller, Request, Get, Post } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { KycTokenDto } from "./dto/kyc-token.dto";
import { ApiErrorDecorators } from "./exception/error-response.decorator";
import { BusinessException } from "./exception/business.exception";
import { KycErrorCode } from "./exception/error-codes";
import { KycService } from "./kyc.service";
import { SimplifiedKyc } from "./dto/kyc.dto";

@ApiTags("kyc")
@Controller("kyc")
@ApiErrorDecorators()
export class KycController {
    constructor(
        private readonly kycService: KycService,
        public Authenticated: () => MethodDecorator,
    ) {}

    @ApiOperation({ summary: "Get authenticated user simplified kyc" })
    @KycController.prototype.Authenticated()
    @Get("")
    @ApiException(() => new BusinessException(KycErrorCode.KYC_NOT_FOUND))
    @ApiException(() => new BusinessException(KycErrorCode.SUMSUB_REQUEST_ERROR))
    @ApiOkResponse({ type: SimplifiedKyc })
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async getSimplified(@Request() req): Promise<SimplifiedKyc> {
        const simplifiedKyc = await this.kycService.getSimplifiedKyc(req.user.id);
        return simplifiedKyc;
    }

    @ApiOperation({ summary: "Get authenticated user kyc token" })
    @KycController.prototype.Authenticated()
    @Get("token")
    @ApiException(() => new BusinessException(KycErrorCode.KYC_NOT_FOUND))
    @ApiException(() => new BusinessException(KycErrorCode.SUMSUB_REQUEST_ERROR))
    @ApiOkResponse({ type: KycTokenDto })
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async getToken(@Request() req): Promise<KycTokenDto> {
        return this.kycService.getToken(req.user.id);
    }

    @ApiOperation({ summary: "Simulate kyc success" })
    @KycController.prototype.Authenticated()
    @Post("success")
    @ApiException(() => new BusinessException(KycErrorCode.KYC_NOT_FOUND))
    @ApiException(() => new BusinessException(KycErrorCode.SUMSUB_REQUEST_ERROR))
    @ApiOkResponse()
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async simulateSuccess(@Request() req): Promise<void> {
        await this.kycService.simulateSuccess(req.user.id);
    }

    @ApiOperation({ summary: "Simulate kyc failure" })
    @KycController.prototype.Authenticated()
    @Post("failure")
    @ApiException(() => new BusinessException(KycErrorCode.KYC_NOT_FOUND))
    @ApiException(() => new BusinessException(KycErrorCode.SUMSUB_REQUEST_ERROR))
    @ApiOkResponse()
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async simulateFailure(@Request() req): Promise<void> {
        await this.kycService.simulateFailure(req.user.id);
    }
}
