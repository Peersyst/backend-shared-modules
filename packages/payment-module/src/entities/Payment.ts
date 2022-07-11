import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PaymentType } from "../implementations/payment-type";
import { Currency } from "../implementations/currency";

export enum PaymentStatus {
    Pending = "pending",
    Completed = "completed",
    Redeemed = "redeemed",
    Rejected = "rejected",
    Approved = "approved",
    Saved = "saved",
    Created = "created",
}

@Entity("payment", { schema: "db_database" })
export class Payment {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("int", { name: "user_id" })
    userId: number;

    @Column("enum", { name: "type", enum: PaymentType })
    type: PaymentType;

    @Column("int", { name: "amount" })
    amount: number;

    @Column("enum", { name: "currency", nullable: true, enum: Currency })
    currency?: Currency | null;

    @Column("enum", { name: "status", enum: PaymentStatus, default: PaymentStatus.Pending })
    status?: PaymentStatus = PaymentStatus.Pending;

    @Column("varchar", { name: "reference", nullable: true, length: 255 })
    reference?: string | null;

    @Column("varchar", { name: "meta", nullable: true, length: 2048 })
    meta?: string | null;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt: Date;
}
