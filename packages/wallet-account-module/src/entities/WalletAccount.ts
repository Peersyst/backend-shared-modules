import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("wallet_account")
export class WalletAccount {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;
    
    @Column("int", { name: "user_id", unique: true })
    userId: number;

    @Column("varchar", { name: "encrypted_private_key", length: 255 })
    encryptedPrivateKey: string;

    @Column("varchar", { name: "address", length: 100 })
    address: string;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt: Date;
}
