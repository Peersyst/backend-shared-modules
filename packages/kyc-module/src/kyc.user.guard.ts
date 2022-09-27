import { CanActivate, ExecutionContext, Injectable, Inject } from "@nestjs/common";
import { KycService } from "./kyc.service";

@Injectable()
export class KycUserGuard implements CanActivate {
    constructor(@Inject("KycService") private readonly kycService: KycService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { user } = request;
        if (!user) {
            return false;
        }

        try {
            const kyc = await this.kycService.getKyc(user.id);

            return !!kyc;
        } catch (err) {
            return false;
        }
    }
}
