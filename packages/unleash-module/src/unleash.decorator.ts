import { Inject } from '@nestjs/common';
import { UnleashService } from './unleash.service';

export function UnleashToggle(name: string) {
    const injectUnleashService = Inject(UnleashService);

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        injectUnleashService(target, "unleashService");
        const method = descriptor.value;

        const unleashService: UnleashService = this.unleashService;
        const unleash = unleashService.getUnleash();
      
        descriptor.value = function (...args) {
            if (!unleash.isEnabled(name)) {
                // If it is not enabled, exit function
                return;
            }
            
            method.apply(this, args);
        };
    }
}
