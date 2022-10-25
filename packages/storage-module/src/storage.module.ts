import { DynamicModule, ForwardReference, Module, ModuleMetadata, Provider, Type } from "@nestjs/common";
import { STORAGE_MODULE_OPTIONS } from "./storage.constants";
import stream from "stream";
import { LocalStorageService } from "./local-storage.service";
import { S3StorageService } from "./s3-storage.service";

export enum StorageType {
    S3 = "s3",
    LOCAL = "local",
}

export interface StorageModuleOptions {
    storageType: StorageType;
    rootPath?: string;
    awsBucket?: string;
    awsRegion?: string;
    awsAccessKeyId?: string;
    awsSecretAccessKey?:  string;
}

export interface FileInformation {
    path: string;
    mimetype?: string;
    encoding?: string;
    size?: number;
}

export interface StorageServiceInterface {
    getFileAsBuffer(filePath: string): Promise<Buffer>;
    getFileAsStream(filePath: string): Promise<stream.Readable>;
    storeFileFromBuffer(fileBuffer: Buffer, fileInformation: FileInformation): Promise<void>;
    deleteFile(filePath: string): Promise<void>;
    getFileSize(filePath: string): Promise<number>;
    writeFileStream(filePath: string, onSuccess: () => void, onError: (err: Error) => void): stream.Writable;
}

export interface StorageOptionsFactory {
    createStorageOptions(): Promise<StorageModuleOptions> | StorageModuleOptions;
}

export interface StorageModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    useExisting?: Type<StorageOptionsFactory>;
    useClass?: Type<StorageOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<StorageModuleOptions> | StorageModuleOptions;
    inject?: any[];
}

export function createStorageProviders(options: StorageModuleOptions): any[] {
    const providers: Provider[] = [];

    if (options.storageType === StorageType.LOCAL) {
        providers.push({ provide: "StorageService", useClass: LocalStorageService });
    } else if (options.storageType === StorageType.S3) {
        providers.push({ provide: "StorageService", useClass: S3StorageService });
    }

    return [{ provide: STORAGE_MODULE_OPTIONS, useValue: options || {} }, ...providers];
}

export function createStorageExports(options: StorageModuleOptions): any[] {
    const exports: Provider[] = [];

    if (options.storageType === StorageType.LOCAL) {
        exports.push({ provide: "StorageService", useClass: LocalStorageService });
    } else if (options.storageType === StorageType.S3) {
        exports.push({ provide: "StorageService", useClass: S3StorageService });
    }

    return exports;
}

@Module({})
export class StorageModule {
    static register(options: StorageModuleOptions): DynamicModule {
        const controllers: Type<any>[] = [];
        const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [];

        return {
            module: StorageModule,
            imports,
            providers: createStorageProviders(options),
            controllers,
            exports: createStorageExports(options),
        };
    }

    static registerAsync(options: StorageModuleAsyncOptions): DynamicModule {
        return {
            module: StorageModule,
            global: true,
            imports: options.imports || [],
            providers: [
                ...this.createAsyncProviders(options),
            ],
            exports: ["StorageService"],
        };
    }

    private static createAsyncProviders(
        options: StorageModuleAsyncOptions
    ): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [
                this.createAsyncOptionsProvider(options),
                this.createAsyncStorageProvider(),
            ];
        }
        return [
            this.createAsyncOptionsProvider(options),
            this.createAsyncStorageProvider(),
            {
                provide: options.useClass,
                useClass: options.useClass
            }
        ];
    }

    private static createAsyncOptionsProvider(
        options: StorageModuleAsyncOptions
    ): Provider {
        if (options.useFactory) {
            return {
                provide: STORAGE_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            provide: STORAGE_MODULE_OPTIONS,
            useFactory: async (optionsFactory: StorageOptionsFactory) =>
                await optionsFactory.createStorageOptions(),
            inject: [options.useExisting || options.useClass]
        };
    }

    private static createAsyncStorageProvider(): Provider {
        return {
            provide: "StorageService",
            useFactory: (options: StorageModuleOptions) => {
                if (options.storageType === StorageType.LOCAL) {
                    return new LocalStorageService(options);
                } else if (options.storageType === StorageType.S3) {
                    return new S3StorageService(options);
                }
            },
            inject: [STORAGE_MODULE_OPTIONS],
        };
    }
}
