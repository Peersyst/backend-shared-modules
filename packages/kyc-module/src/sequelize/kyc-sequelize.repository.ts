import { InjectModel } from "@nestjs/sequelize";
import { KycAnswer, KycI, KycRejectType, KycStatus } from "../dto/kyc.dto";
import { KycRepositoryInterface } from "../kyc.service";
import { KycModel } from "./KycModel";

export class KycSequelizeRepository implements KycRepositoryInterface {
    constructor(@InjectModel(KycModel) private readonly kycRepository: typeof KycModel) {}

    async create(userId: number, applicantId: string): Promise<KycI> {
        const kycModel = await this.kycRepository.create({
            userId, applicantId, status: KycStatus.INIT, reviewAnswer: KycAnswer.GREEN
        });

        return this.transformModelToDto(kycModel);
    }

    async findByUserId(userId: number): Promise<KycI> {
        const kycModel = await this.kycRepository.findOne({
            where: { userId }
        });

        return kycModel ? this.transformModelToDto(kycModel): null;
    }

    async findByApplicantId(applicantId: string): Promise<KycI> {
        const kycModel = await this.kycRepository.findOne({
            where: { applicantId }
        });

        return kycModel ? this.transformModelToDto(kycModel): null;
    }

    async update(id: number, updateData: Partial<KycI>): Promise<void> {
        const updateInfo: any = {
            ...updateData,
            rejectLabels: JSON.stringify(updateData.rejectLabels)
        };
        if (!updateData.rejectLabels) {
            delete updateInfo.rejectLabels;
        }
        await this.kycRepository.update(updateInfo, { where: { id } });
    }

    private transformModelToDto(model: KycModel): KycI {
        return {
            id: model.id,
            userId: model.userId,
            applicantId: model.applicantId,
            status: model.status as KycStatus,
            reviewAnswer: model.reviewAnswer as KycAnswer,
            moderationComment: model.moderationComment,
            clientComment: model.clientComment,
            reviewRejectType: model.reviewRejectType as KycRejectType,
            rejectLabels: model.rejectLabels ? JSON.parse(model.rejectLabels) : undefined,
            passed: model.status === KycStatus.COMPLETED && model.reviewAnswer === KycAnswer.GREEN,
            updatedAt: model.updatedAt,        
        }
    }
}
