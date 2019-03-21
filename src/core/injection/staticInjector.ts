import Injector from './injector';
import { ProviderRecord, TConstructor } from '../../types/internal';

export default class StaticInjector {
    private constructor() {
        throw new Error('StaticInjector is not constructable');
    }

    private static readonly _injector: Injector = Injector.create();

    static registerProvider(...providers: ProviderRecord[]) {
        return StaticInjector._injector.registerProvider(...providers);
    }

    static resolve<T>(token: TConstructor<T>): T {
        return StaticInjector._injector.resolve<T>(token);
    }

    static has(token: TConstructor): boolean {
        return StaticInjector._injector.has(token);
    }

    static toString() {
        return `Static${StaticInjector._injector.toString()}`;
    }
}
