import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("transaction")
export class Transaction {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "from_address", nullable: false, length: 100 })
    from: string;

    @Column("varchar", { name: "to_address", nullable: false, length: 100 })
    to: string;

    @Column("text", { name: "payload", nullable: false })
    payload: string;

    @Column("int", { name: "amount" })
    amount: number;

    @Column("varchar", { name: "hash", nullable: false, length: 255 })
    hash: string;

    @Column("varchar", { name: "status", nullable: false, length: 255 })
    status: string;

    @Column("varchar", { name: "type", length: 100 })
    type: string;

    @Column("text", { name: "receipt", nullable: true })
    receipt?: string;

    @Column("text", { name: "metadata", nullable: true })
    metadata?: string;

    @Column("text", { name: "errorMessage", nullable: true })
    errorMessage?: string;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt: Date;
}