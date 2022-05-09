import { Inject } from '@nestjs/common';
import { UnleashBusinessException } from './exception/business.exception';
import { UnleashErrorCode } from './exception/error-codes';
import { UnleashService } from './unleash.service';

export function UnleashToggle(name: string) {
    const injectUnleashService = Inject(UnleashService);

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        injectUnleashService(target, "unleashService");
        const method = descriptor.value;
      
        descriptor.value = function (...args) {
            const unleashService: UnleashService = this.unleashService;
            const unleash = unleashService.getUnleash();

            if (!unleash.isEnabled(name)) {
                // If it is not enabled, exit function
                throw new UnleashBusinessException(UnleashErrorCode.METHOD_NOT_AVAILABLE);
            }
            
            method.apply(this, args);
        };
    }
}
