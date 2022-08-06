import { DynamicModule, Module, Provider, Type, ForwardReference, ModuleMetadata } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { XummService } from "./xumm.service";
import { XummEntity, XummTypeormRepository } from "./typeorm";
import { XummAuthService, XummAuthServiceI } from "./xumm-auth.service";
import { XummAuthStrategy } from "./strategies";
import { JwtModule } from "@nestjs/jwt";
import { XummAuthController, XummController } from "./xumm.controller";
import { PassportModule } from "@nestjs/passport";
import { XummJwtStrategy } from "./strategies/xumm-jwt.strategy";

export const XUMM_MODULE_OPTIONS = "XUMM_MODULE_OPTIONS";

export interface XummAuthModuleOptions {
    secret: string;
}

export type XummModuleOptions<AuthEnabled extends boolean> = AuthEnabled extends true
    ? { jwt: XummAuthModuleOptions }
    : // eslint-disable-next-line @typescript-eslint/ban-types
      {};

export interface XummOptionsFactory<AuthEnabled extends boolean> {
    createXummOptions(): Promise<XummModuleOptions<AuthEnabled>> | XummModuleOptions<AuthEnabled>;
}

export interface XummAuthModuleAsyncOptions {
    useXummAuthProvider?: XummAuthServiceI;
}

export interface XummModuleExtras<AuthEnabled extends boolean = true> {
    enableStatus?: boolean;
    enableAuth?: AuthEnabled;
}

export type XummModuleAsyncOptions<AuthEnabled extends boolean = true> = Pick<ModuleMetadata, "imports"> &
    XummModuleExtras<AuthEnabled> & {
        useExisting?: Type<XummOptionsFactory<AuthEnabled>>;
        useClass?: Type<XummOptionsFactory<AuthEnabled>>;
        useFactory?: (...args: any[]) => Promise<XummModuleOptions<AuthEnabled>> | XummModuleOptions<AuthEnabled>;
        inject?: any[];
    } & (AuthEnabled extends true
        ? XummAuthModuleAsyncOptions
        : // eslint-disable-next-line @typescript-eslint/ban-types
          {});

@Module({})
export class XummModule {
    static forRootAsync<AuthEnabled extends boolean = true>(options: XummModuleAsyncOptions<AuthEnabled>): DynamicModule {
        const { enableAuth = true, enableStatus = true, useFactory } = options;
        let providers: Provider[] = [
            ...this.createAsyncProviders<AuthEnabled>(options),
            XummService,
            { provide: "XummRepository", useClass: XummTypeormRepository },
        ];
        const controllers: Type[] = [];
        let imports: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
            ...(options.imports || []),
            TypeOrmModule.forFeature([XummEntity]),
        ];
        const exports: Provider[] = [XummService];

        if (enableStatus) {
            controllers.push(XummController);
        }
        if (enableAuth) {
            const ExtendedXummAuthService = (options as XummModuleAsyncOptions<true>).useXummAuthProvider;
            providers = [...providers, ExtendedXummAuthService, XummJwtStrategy, XummAuthStrategy];
            controllers.push(XummAuthController);
            imports = [
                ...imports,
                PassportModule,
                JwtModule.registerAsync({
                    inject: options.inject,
                    useFactory: async (...providers) => {
                        const options = await useFactory(...providers) as XummModuleOptions<true>;
                        return {
                            ...options.jwt,
                            signOptions: { expiresIn: "604800s" },
                        };
                    },
                }),
            ];
            exports.push(ExtendedXummAuthService);
        }

        return {
            module: XummModule,
            global: true,
            imports,
            providers,
            controllers,
            exports,
        };
    }

    private static createAsyncProviders<AuthEnabled extends boolean>(options: XummModuleAsyncOptions<AuthEnabled>): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider<AuthEnabled>(options)];
        }
        return [
            this.createAsyncOptionsProvider<AuthEnabled>(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }

    private static createAsyncOptionsProvider<AuthEnabled extends boolean>(options: XummModuleAsyncOptions<AuthEnabled>): Provider {
        if (options.useFactory) {
            return {
                provide: XUMM_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: XUMM_MODULE_OPTIONS,
            useFactory: async (optionsFactory: XummOptionsFactory<AuthEnabled>) => await optionsFactory.createXummOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }
}
