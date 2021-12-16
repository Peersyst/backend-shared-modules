import * as stream from 'stream';
import { DynamicModule, Module, Provider, Type, ForwardReference } from "@nestjs/common";
import { S3StorageService } from "./s3-storage.service";
import { LocalStorageService } from "./local-storage.service";

export enum StorageType {
    S3 = "s3",
    LOCAL = "local",
}

export interface StorageModuleOptions {
    storageType: StorageType;
}

export interface FileInformation {
    path: string;
    mimetype?: string;
    encoding?: string;
    size?: number;
}

export interface StorageServiceInterface {
    getFileAsBuffer(filePath: string): Promise<Buffer>;
    getFileAsStream(filePath: string): stream.Readable;
    storeFileFromBuffer(fileBuffer: Buffer, fileInformation: FileInformation): Promise<void>;
    deleteFile(filePath: string): Promise<void>;
    getFileSize(filePath: string): Promise<number>;
    writeFileStream(filePath: string, onSuccess: () => void, onError: (err: Error) => void): stream.Writable;
}

@Module({})
export class StorageModule {
    static register(ConfigModule: Type, options: StorageModuleOptions): DynamicModule {
        const providers: Provider[] = [];
        const controllers: Type<any>[] = [];
        const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
            ConfigModule,            
        ];
        const exports: Provider[] = [];

        if (options.storageType === StorageType.LOCAL) {
            providers.push({ provide: "StorageService", useClass: LocalStorageService });
            exports.push({ provide: "StorageService", useClass: LocalStorageService });
        } else if (options.storageType === StorageType.S3) {
            providers.push({ provide: "StorageService", useClass: S3StorageService });
            exports.push({ provide: "StorageService", useClass: S3StorageService });
        }

        return {
            module: StorageModule,
            imports,
            providers,
            controllers,
            exports,
        };
    }
}


