import { VerifyEmailToken } from "../entities/VerifyEmailToken";

export class VerifyEmailTokenDTO {
    public id: number;
    public userId: number;
    public token: string;
    public verified: boolean;
    public createdAt: Date;

    static fromEntity(entity: VerifyEmailToken): VerifyEmailTokenDTO {
        return {
            id: entity.id,
            userId: entity.userId,
            token: entity.token,
            verified: entity.verified,
            createdAt: entity.createdAt,
        };
    }
}
