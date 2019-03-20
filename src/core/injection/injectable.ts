import 'reflect-metadata';
import { TConstructor } from '../../types/index';
import StaticInjector from './staticInjector';

export const INJECTABLE_FLAG = Symbol('Velay:Injectable');
export const INJECTION_CACHEABLE_FLAG = Symbol('Velay:InjectionCacheable');

interface InjectableOptions {
    disableCache: boolean;
}

export function Injectable(options?: InjectableOptions): any {
    const disableCache = !!((options || {}) as InjectableOptions).disableCache;
    return function(target: TConstructor) {
        // const paramTypes = Reflect.getMetadata('design:paramtypes', target);
        Reflect.defineMetadata(INJECTABLE_FLAG, true, target);
        Reflect.defineMetadata(INJECTION_CACHEABLE_FLAG, disableCache, target);
        // Reflect.defineMetadata(INJECTED_PARAMS_METADATA_KEY, paramTypes, target);
        return target;
    };
}
