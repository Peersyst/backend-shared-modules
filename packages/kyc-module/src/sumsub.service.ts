import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";
import { KycAnswer, KycRejectType } from "./dto/kyc.dto";
import { BusinessException } from "./exception/business.exception";
import { KycErrorCode } from "./exception/error-codes";

@Injectable()
export class SumsubService {
    constructor(
        @Inject(ConfigService) private configService: ConfigService,
    ) {}

    private generateSignature(timestamp: number, method: "GET" | "POST", url: string, body?: string): string {
        const signature = crypto.createHmac("sha256", this.configService.get("sumsub.secretKey"));
        signature.update(timestamp + method + url);

        if (body !== undefined) {
            signature.update(body);
        }

        return signature.digest("hex");
    }

    // Generates new account address and private key
    async generateAccessToken(externalUserId: string): Promise<string> {
        const uri = `/resources/accessTokens?userId=${externalUserId}`;
        const ts = Math.floor(Date.now() / 1000);
        const signature = this.generateSignature(ts, "POST", uri);
        const url = `${this.configService.get("sumsub.baseUrl")}${uri}`;

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-App-Token": this.configService.get("sumsub.appToken"),
                "X-App-Access-Sig": signature,
                "X-App-Access-Ts": `${ts}`,
            },
        };
        const response = await fetch(url, options);

        const json = await response.json();
        if (!json || !json.token) {
            throw new BusinessException(KycErrorCode.SUMSUB_REQUEST_ERROR);
        }

        return json.token;
    }

    // TODO: remove. For testing purposes only
    async simulateGreenReview(applicantId: string): Promise<void> {
        const uri = `/resources/applicants/${applicantId}/status/testCompleted`;
        const ts = Math.floor(Date.now() / 1000);
        const body = { reviewAnswer: KycAnswer.GREEN, rejectLabels: [] }
        const signature = this.generateSignature(ts, "POST", uri, JSON.stringify(body));
        const url = `${this.configService.get("sumsub.baseUrl")}${uri}`;

        var options = {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
                "X-App-Token": this.configService.get("sumsub.appToken"),
                "X-App-Access-Sig": signature,
                "X-App-Access-Ts": `${ts}`,
            },
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new BusinessException(KycErrorCode.SUMSUB_REQUEST_ERROR);
        }
    }

    // TODO: remove. For testing purposes only
    async simulateRedReview(applicantId: string): Promise<void> {
        const uri = `/resources/applicants/${applicantId}/status/testCompleted`;
        const ts = Math.floor(Date.now() / 1000);
        const body = {
            reviewAnswer: KycAnswer.RED,
            rejectLabels: ["CRIMINAL"],
            reviewRejectType: KycRejectType.RETRY,
            clientComment: "this is a criminal",
            moderationComment: "Please go to your nearest jail",
        };
        const signature = this.generateSignature(ts, "POST", uri, JSON.stringify(body));
        const url = `${this.configService.get("sumsub.baseUrl")}${uri}`;

        var options = {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
                "X-App-Token": this.configService.get("sumsub.appToken"),
                "X-App-Access-Sig": signature,
                "X-App-Access-Ts": `${ts}`,
            },
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new BusinessException(KycErrorCode.SUMSUB_REQUEST_ERROR);
        }
    }
}
