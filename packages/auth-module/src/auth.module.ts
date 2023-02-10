import { DynamicModule, Module, Provider, Type, ForwardReference } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthModuleAsyncOptions, AuthOptionsFactory, PassportModule } from "@nestjs/passport";
import { AuthController, AuthGoogleController, AuthRecoverController, AuthTwitterController, AuthValidateController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies";
import { LocalStrategy } from "./strategies";
import { GoogleStrategy } from "./strategies";
import { TwitterStrategy } from "./strategies";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VerifyEmailToken } from "./entities";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { ResetToken } from "./entities";
import { ValidateEmailService } from "./validate-email.service";
import { RecoverPasswordService } from "./recover-password.service";
import { BlockDeletedGuard } from "./guards";

export interface AuthModuleOptions {
    googleAuth?: boolean;
    twitterAuth?: boolean;
    validateEmail?: boolean;
    recoverPassword?: boolean;
    twoFA?: boolean;
    NotificationModule?: Type;
}

@Module({})
export class AuthModule {
    static register(UserModule: Type, ConfigModule: Type, ConfigService: any, options?: AuthModuleOptions): DynamicModule {
        const providers: Provider[] = [LocalStrategy, JwtStrategy, AuthService, BlockDeletedGuard];
        const controllers: Type<any>[] = [AuthController];
        const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
            PassportModule,
            JwtModule.registerAsync({
                imports: [ConfigModule],
                useFactory: async (configService: typeof ConfigService) => ({
                    secret: configService.get("server.secretKey"),
                    signOptions: { expiresIn: "7d" },
                }),
                inject: [ConfigService],
            }),
            ConfigModule,
            UserModule,
        ];
        const entities: EntityClassOrSchema[] = [];
        const exports: Provider[] = [AuthService];

        if (options) {
            if (options.googleAuth) {
                providers.push(GoogleStrategy);
                controllers.push(AuthGoogleController);
            }
            if (options.twitterAuth) {
                providers.push(TwitterStrategy);
                controllers.push(AuthTwitterController);
            }
            if (options.validateEmail) {
                entities.push(VerifyEmailToken);
                providers.push(ValidateEmailService);
                exports.push(ValidateEmailService);
                controllers.push(AuthValidateController);
            }
            if (options.recoverPassword && !options.NotificationModule) {
                throw new Error("Must indicate NotificationModule when recoverPassword = true");
            }
            if (options.recoverPassword) {
                entities.push(ResetToken);
                providers.push(RecoverPasswordService);
                exports.push(RecoverPasswordService);
                controllers.push(AuthRecoverController);
                imports.push(options.NotificationModule);
            }
            if (entities.length > 0) {
                imports.push(TypeOrmModule.forFeature(entities));
                exports.push(TypeOrmModule);
            }
        }

        return {
            module: AuthModule,
            imports,
            providers,
            controllers,
            exports,
        };
    }

    static forRootAsync(options: AuthModuleAsyncOptions): DynamicModule {
        const { useFactory, inject } = options;

        let providers: Provider[] = [
            ...this.createAsyncProviders(options),
            AuthService,
        ];
        const exports: Provider[] = [AuthService];
        const controllers: Type[] = [AuthController];
        const imports: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
            ...(options.imports || []),
            PassportModule,
            JwtModule.registerAsync({
                inject: inject,
                useFactory: async (...providers) => {
                    const options = await useFactory(...providers) ;
                    return {
                        ...options,
                        signOptions: { expiresIn: "7d" },
                    }
                }
            })
        ]

        return {
            module: AuthModule,
            global: true,
            imports,
            providers,
            controllers,
            exports,
        };

    }

    private static createAsyncProviders(options: AuthModuleAsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }

    private static createAsyncOptionsProvider(options: AuthModuleAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: "AUTH_MODULE_OPTIONS",
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: "AUTH_MODULE_OPTIONS",
            useFactory: async (optionsFactory: AuthOptionsFactory) =>
                await optionsFactory.createAuthOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }

}


