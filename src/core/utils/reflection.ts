import { TConstructor } from '../../types/internal';
import Debugger from './debugger';
import StaticInjector from '../injection/staticInjector';

export function getInjectedConstructor(target: TConstructor): TConstructor | null {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
    const params: any[] = [];
    for (let i = 0; i < paramTypes.length; i++) {
        const paramType = paramTypes[i];
        if (typeof paramType !== 'function') {
            Debugger.warn(`pamameter ${i + 1} of ${target.name} is not a constructor`);
            return null;
        }
        if (paramType === Object || paramType === Function) {
            Debugger.warn(`pamameter ${i + 1} of ${target.name} is not a valid constructor`);
            return null;
        }

        if (!StaticInjector.has(paramType)) {
            Debugger.warn(`${paramType.name} cannot be resolved`);
            const subParamTypes = Reflect.getMetadata('design:paramtypes', paramType) || [];
            if (subParamTypes.length === 0) {
                params.push(new paramType());
            } else {
                params.push(undefined);
            }
        } else {
            params.push(StaticInjector.resolve(paramType));
        }
    }
    const InjectedConstructor: any = function() {
        return new target(...params);
    };

    InjectedConstructor.prototype = target.prototype;
    Object.defineProperty(InjectedConstructor, 'name', {
        writable: false,
        configurable: false,
        value: target.name
    });

    return InjectedConstructor;
}
