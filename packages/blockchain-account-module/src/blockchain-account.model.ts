import {
	Model, Table, Column, DataType, Index,
} from "sequelize-typescript";

interface BlockchainAccountModelAttributes {
    id?: number;
    userId: number;
    address: string;
    publicKey: string;
	encryptedPrivateKey: string;
}

@Table({
	tableName: "blockchain_account",
	timestamps: true
})
export class BlockchainAccountModel extends Model<BlockchainAccountModelAttributes, BlockchainAccountModelAttributes> implements BlockchainAccountModelAttributes {

	@Column({
		primaryKey: true,
		type: DataType.INTEGER
	})
	@Index({
		name: "PRIMARY",
		using: "BTREE",
		order: "ASC",
		unique: true
	})
	id?: number;

	@Column({
		field: "user_id",
		type: DataType.INTEGER
	})
	userId!: number;

	@Column({
		field: "public_key",
		type: DataType.STRING(100)
	})
	address!: string;

	@Column({
		field: "public_key",
		type: DataType.STRING(100)
	})
	publicKey!: string;

	@Column({
		field: "public_key",
		type: DataType.STRING(100)
	})
	encryptedPrivateKey!: string;
}