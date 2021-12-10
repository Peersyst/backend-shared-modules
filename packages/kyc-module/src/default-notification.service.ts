import { Injectable } from "@nestjs/common";
import { KycNotificationInterface } from "./kyc.service";


@Injectable()
export class DefaultNotificationService implements KycNotificationInterface {
    async sendKycPendingNotification(email: string): Promise<void> {
        return Promise.resolve();
    }

    async sendKycPassedNotification(email: string): Promise<void> {
        return Promise.resolve();
    }

    async sendKycRetryNotification(email: string, moderationComment: string): Promise<void> {
        return Promise.resolve();
    }

}
