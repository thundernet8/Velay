import 'reflect-metadata';
import { TConstructor, InjectableOptions } from '../../types/internal';
import StaticInjector from './staticInjector';
import { EMPTY, INJECTABLE_FLAG, INJECTION_CACHEABLE_FLAG } from './constant';
import { isFunction } from '../utils/index';
import { isStoreService } from '../store/vuex';

const DEFAULT_INJECTABLE_OPTIONS: InjectableOptions = {
    cacheable: true
};

export default function Injectable(options?: InjectableOptions | TConstructor): any {
    let mergedOptions: any;
    if (isFunction(options)) {
        mergedOptions = Object.assign({}, DEFAULT_INJECTABLE_OPTIONS);

        // StoreService should not be cacheable, it can be used in different vue component instances but the state is not sharable
        if (isStoreService(options)) {
            mergedOptions.cacheable = false;
        }

        Reflect.defineMetadata(INJECTABLE_FLAG, true, options as TConstructor);
        StaticInjector.registerProvider({
            token: options as TConstructor,
            cacheable: mergedOptions.cacheable,
            value: EMPTY
        });
        return options;
    }
    mergedOptions = Object.assign({}, DEFAULT_INJECTABLE_OPTIONS, options || {});
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
    } as any;
}
