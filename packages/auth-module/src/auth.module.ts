import { DynamicModule, Module, Provider, Type, ForwardReference } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController, AuthGoogleController, AuthRecoverController, AuthTwitterController, AuthValidateController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { TwitterStrategy } from "./strategies/twitter.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VerifyEmailToken } from "./entities/VerifyEmailToken";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { ResetToken } from "./entities/ResetToken";
import { ValidateEmailService } from "./validate-email.service";
import { RecoverPasswordService } from "./recover-password.service";

export interface AuthModuleOptions {
    googleAuth?: boolean;
    twitterAuth?: boolean;
    validateEmail?: boolean;
    recoverPassword?: boolean;
    twoFA?: boolean;
    NotificationService?: Provider;
}

@Module({})
export class AuthModule {
    static register(UserModule: Type, ConfigModule: Type, ConfigService: any, options?: AuthModuleOptions): DynamicModule {
        const providers: Provider[] = [LocalStrategy, JwtStrategy, AuthService];
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
            if (options.recoverPassword && !options.NotificationService) {
                throw new Error("Must indicate NotificationService when recoverPassword = true");
            }
            if (options.recoverPassword) {
                entities.push(ResetToken);
                providers.push(RecoverPasswordService);
                exports.push(RecoverPasswordService);
                controllers.push(AuthRecoverController);
                providers.push(options.NotificationService);
            }
            if (entities.length > 0) {
                imports.push(TypeOrmModule.forFeature(entities));
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
}


