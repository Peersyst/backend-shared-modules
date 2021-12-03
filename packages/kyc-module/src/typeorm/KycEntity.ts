import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { KycAnswer, KycRejectType, KycStatus } from "../dto/kyc.dto";

@Entity("kyc")
export class KycEntity {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id?: number;

    @Column("int", { name: "user_id", unique: true })
    userId: number;

    @Column("varchar", { length: 255, name: "applicant_id" })
    applicantId: string;

    @Column({ type: "enum", enum: KycStatus })
    status: KycStatus;

    @Column({ type: "enum", enum: KycAnswer, name: "review_answer" })
    reviewAnswer: KycAnswer;

    @Column({ type: "text", name: "moderation_comment", nullable: true })
    moderationComment?: string;

    @Column({ type: "text", name: "client_comment", nullable: true })
    clientComment?: string;

    @Column({ type: "enum", enum: KycRejectType, name: "review_reject_type", nullable: true })
    reviewRejectType?: KycRejectType;

    @Column("varchar", { length: 255, name: "reject_labels" })
    rejectLabels?: string;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt: Date;
}