import { Inject, Injectable } from "@nestjs/common";

export interface ICustomConfigService {
    get<T>(key: string): T;
}

@Injectable()
export class ConfigService {
    constructor(@Inject("ConfigService") private readonly configService: ICustomConfigService) {}

    get<T>
}
