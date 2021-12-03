import { Model, Column, Table, CreatedAt, UpdatedAt, DataType, Index } from "sequelize-typescript";
import { KycStatus, KycAnswer, KycRejectType } from "../dto/kyc.dto";

interface KycModelAttributes {
    id?: number;
    userId: number;
    applicantId: string;
    status: KycStatus;
    reviewAnswer: KycAnswer;
    moderationComment?: string;
    clientComment?: string;
    reviewRejectType?: KycRejectType;
    rejectLabels?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

@Table({ tableName: 'kyc' })
export class KycModel extends Model<KycModelAttributes, KycModelAttributes> implements KycModelAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: "pk_kyc", using: "BTREE", order: "ASC", unique: true })
    id?: number;

    @Column({ field: "user_id", type: DataType.INTEGER })
    @Index({ name: "fk_kyc_user", using: "BTREE", order: "ASC", unique: true })
    userId: number;

    @Column({ type: DataType.STRING(255), field: "applicant_id" })
    applicantId: string;

    @Column({ type: DataType.ENUM, values: Object.values(KycStatus) })
    status: KycStatus;

    @Column({ type: DataType.ENUM, values: Object.values(KycAnswer), field: "applicant_id" })
    reviewAnswer: KycAnswer;

    @Column({ type: DataType.TEXT, field: "moderation_comment" })
    moderationComment?: string;

    @Column({ type: DataType.TEXT, field: "client_comment" })
    clientComment?: string;

    @Column({ type: DataType.ENUM, values: Object.values(KycRejectType), field: "review_reject_type" })
    reviewRejectType?: KycRejectType;

    @Column({ type: DataType.STRING(255), field: "reject_labels" })
    rejectLabels?: string;

    @Column({ field: "created_at", type: DataType.DATE })
    @CreatedAt
    createdAt!: Date;

    @Column({ field: "updated_at", type: DataType.DATE })
    @UpdatedAt
    updatedAt!: Date;
}
