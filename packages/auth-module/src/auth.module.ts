import { DynamicModule, Module, Provider, Type } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController, AuthGoogleController, AuthTwitterController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { TwitterStrategy } from "./strategies/twitter.strategy";

@Module({})
export class AuthModule {
    static register(UserModule: Type, ConfigModule: Type, ConfigService: any, options: { googleAuth: boolean, twitterAuth: boolean }): DynamicModule {
        const providers: Provider[] = [LocalStrategy, JwtStrategy, AuthService];
        const controllers: Type<any>[] = [AuthController];
        if (options.googleAuth) {
            providers.push(GoogleStrategy);
            controllers.push(AuthGoogleController);
        }
        if (options.twitterAuth) {
            providers.push(TwitterStrategy);
            controllers.push(AuthTwitterController);
        }

        return {
            module: AuthModule,
            imports: [
                PassportModule,
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: async (configService: typeof ConfigService) => ({
                        secret: configService.get("server.secretKey"),
                        signOptions: { expiresIn: "600s" },
                    }),
                    inject: [ConfigService],
                }),
                ConfigModule,
                UserModule,
            ],
            providers,
            controllers,
            exports: [AuthService],
        };
    }
}


