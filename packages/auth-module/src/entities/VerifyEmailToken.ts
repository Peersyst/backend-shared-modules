import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity("verify_email_token")
export class VerifyEmailToken {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("int", { name: "user_id", unique: true })
    userId: number;

    @Column("varchar", { length: 255 })
    token!: string;

    @Column("boolean", { name: "verified", default: false })
    verified = false;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;
}
