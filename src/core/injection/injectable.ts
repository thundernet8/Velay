import 'reflect-metadata';
import { TConstructor, InjectableOptions } from '../../types/internal';
import StaticInjector from './staticInjector';
import { EMPTY, INJECTABLE_FLAG, INJECTION_CACHEABLE_FLAG } from './constant';

const DEFAULT_INJECTABLE_OPTIONS: InjectableOptions = {
    cacheable: true
};

export default function Injectable(options?: InjectableOptions): any {
    const mergedOptions = Object.assign({}, DEFAULT_INJECTABLE_OPTIONS, options || {});
    return function(target: TConstructor) {
        // const paramTypes = Reflect.getMetadata('design:paramtypes', target);
        Reflect.defineMetadata(INJECTABLE_FLAG, true, target);
        // Reflect.defineMetadata(INJECTION_CACHEABLE_FLAG, mergedOptions.cacheable, target);
        // Reflect.defineMetadata(INJECTED_PARAMS_METADATA_KEY, paramTypes, target);
        StaticInjector.registerProvider({
            token: target,
            cacheable: mergedOptions.cacheable,
            value: EMPTY
        });
    };
}
