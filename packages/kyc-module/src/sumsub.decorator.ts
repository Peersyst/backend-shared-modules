import { applyDecorators, UseGuards } from "@nestjs/common";
import { DigestGuard } from "./sumsub.digest.guard";

export function DigestedFromSumsub(): MethodDecorator & ClassDecorator {
    return applyDecorators(
        UseGuards(DigestGuard),
    );
}
