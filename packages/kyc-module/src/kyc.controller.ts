import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { Controller, Request, Get, Post, Param } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Authenticated, UserType } from "@peersyst/auth-module";
import { KycTokenDto } from "./dto/kyc-token.dto";
import { ApiErrorDecorators } from "./exception/error-response.decorator";
import { KycBusinessException } from "./exception/business.exception";
import { KycErrorCode } from "./exception/error-codes";
import { KycService } from "./kyc.service";
import { SimplifiedKyc, Kyc } from "./dto/kyc.dto";

@ApiTags("kyc")
@Controller("kyc")
@ApiErrorDecorators()
export class KycController {
    constructor(private readonly kycService: KycService) {}

    @ApiOperation({ summary: "Get authenticated user kyc" })
    @Authenticated()
    @Get("me")
    @ApiException(() => new KycBusinessException(KycErrorCode.KYC_NOT_FOUND))
    @ApiException(() => new KycBusinessException(KycErrorCode.SUMSUB_REQUEST_ERROR))
    @ApiOkResponse({ type: Kyc })
    async getMe(@Request() req): Promise<Kyc> {
        return await this.kycService.getKyc(req.user.id);
    }

    @ApiOperation({ summary: "Get authenticated user kyc token" })
    @Authenticated()
    @Get("token")
    @ApiException(() => new KycBusinessException(KycErrorCode.KYC_NOT_FOUND))
    @ApiException(() => new KycBusinessException(KycErrorCode.SUMSUB_REQUEST_ERROR))
    @ApiOkResponse({ type: KycTokenDto })
    async getToken(@Request() req): Promise<KycTokenDto> {
        return this.kycService.getToken(req.user.id);
    }

    @ApiOperation({ summary: "Get user simplified kyc" })
    @Authenticated(UserType.ADMIN)
    @Get(":id")
    @ApiException(() => new KycBusinessException(KycErrorCode.KYC_NOT_FOUND))
    @ApiException(() => new KycBusinessException(KycErrorCode.SUMSUB_REQUEST_ERROR))
    @ApiOkResponse({ type: SimplifiedKyc })
    async getUserSimplified(@Param("id") id: number): Promise<SimplifiedKyc> {
        return this.kycService.getSimplifiedKyc(id);
    }
}
