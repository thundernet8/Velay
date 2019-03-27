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
        Reflect.defineMetadata(INJECTABLE_FLAG, true, options as TConstructor);
        StaticInjector.registerProvider({
            token: options as TConstructor,
            cacheable: DEFAULT_INJECTABLE_OPTIONS.cacheable,
            value: EMPTY
        });
        return options;
    }
    mergedOptions = Object.assign({}, DEFAULT_INJECTABLE_OPTIONS, options || {});
    return function(target: TConstructor) {
        Reflect.defineMetadata(INJECTABLE_FLAG, true, target);
        StaticInjector.registerProvider({
            token: target,
            cacheable: mergedOptions.cacheable,
            value: EMPTY
        });
    } as any;
}
