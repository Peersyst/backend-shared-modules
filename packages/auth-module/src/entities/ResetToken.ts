import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("reset_token")
export class ResetToken {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("int", { name: "user_id", unique: true })
    userId: number;

    @Column("varchar", { length: 255 })
    token!: string;

    @Column("timestamp")
    expiration!: Date;

    @Column("boolean", { name: "verified", default: false })
    verified = false;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updatedAt: Date;
}
