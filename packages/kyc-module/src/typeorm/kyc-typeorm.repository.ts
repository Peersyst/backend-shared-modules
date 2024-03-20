import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { KycAnswer, KycI, KycRejectType, KycStatus, SimplifiedKycI } from "../dto/kyc.dto";
import { KycRepositoryInterface } from "../kyc.service";
import { KycEntity } from "./KycEntity";

export class KycTypeormRepository implements KycRepositoryInterface {
    constructor(@InjectRepository(KycEntity) private readonly kycRepository: Repository<KycEntity>) {}

    async create(userId: number, applicantId: string): Promise<KycI> {
        const kycModel = await this.kycRepository.save({
            userId, applicantId, status: KycStatus.INIT, reviewAnswer: KycAnswer.GREEN
        });

        return this.transformEntityToDto(kycModel);
    }

    async findByUserId(userId: number): Promise<KycI> {
        const kycModel = await this.kycRepository.findOne({ where: { userId }});

        return kycModel ? this.transformEntityToDto(kycModel): null;
    }

    async findByUserIdSimplified(userId: number): Promise<SimplifiedKycI> {
        const kycModel = await this.kycRepository.findOne({ where: { userId }});

        return kycModel ? this.transformEntityToSimplifiedDto(kycModel): null;
    }

    async findByApplicantId(applicantId: string): Promise<KycI> {
        const kycModel = await this.kycRepository.findOne({ where: { applicantId } });

        return kycModel ? this.transformEntityToDto(kycModel): null;
    }

    async getKycExternalId(userId: number): Promise<string> {
        const kycModel = await this.kycRepository.findOne({ where: { userId } });
        return kycModel ? kycModel.kycExternalId: null;
    }

    async update(id: number, updateData: Partial<KycI>): Promise<void> {
        const updateInfo: any = {
            ...updateData,
            rejectLabels: JSON.stringify(updateData.rejectLabels)
        };
        if (!updateData.rejectLabels) {
            delete updateInfo.rejectLabels;
        }
        await this.kycRepository.update(id, updateInfo);
    }

    private transformEntityToDto(model: KycEntity): KycI {
        return {
            ...this.transformEntityToSimplifiedDto(model),
            id: model.id,
            applicantId: model.applicantId,
            clientComment: model.clientComment,
            rejectLabels: model.rejectLabels ? JSON.parse(model.rejectLabels) : undefined,
        }
    }

    private transformEntityToSimplifiedDto(model: KycEntity): SimplifiedKycI {
        return {
            userId: model.userId,
            status: model.status as KycStatus,
            reviewAnswer: model.reviewAnswer as KycAnswer,
            moderationComment: model.moderationComment,
            reviewRejectType: model.reviewRejectType as KycRejectType,
            passed: model.status === KycStatus.COMPLETED && model.reviewAnswer === KycAnswer.GREEN,
            updatedAt: model.updatedAt,        
        }
    }
}
