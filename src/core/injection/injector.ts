import { TConstructor, ProviderRecord } from '../../types/internal';
import { INJECTABLE_FLAG } from './constant';
import Debugger from '../utils/debugger';

export default class Injector {
    private readonly _records: Map<any, ProviderRecord>;

    private constructor() {
        this._records = new Map<any, ProviderRecord>();
    }

    static create(): Injector {
        return new Injector();
    }

    static checkInjectable(token: TConstructor): boolean {}

    registerProvider(...providers: ProviderRecord[]): this {
        //
    }

    resolve<T>(token: TConstructor<T>): T {
        const injectableFlag = Reflect.getMetadata(INJECTABLE_FLAG, token);
        if (!injectableFlag) {
            Debugger.warn(`${token.name} is not injectable, do you forgot add the 'Injectable' decorator?`);
            // const subParamTypes = Reflect.getMetadata('design:paramtypes', token) || [];
            // if (subParamTypes.length > 0) {
            //     return null;
            // }
        }
    }

    has(token: TConstructor): boolean {
        //
    }
}
