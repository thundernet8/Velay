import { TConstructor, ProviderRecord } from '../../types/internal';
import { INJECTABLE_FLAG, CIRCULAR, EMPTY } from './constant';
import Debugger from '../utils/debugger';
import VelayError from '../helper/velayError';

export default class Injector {
    private readonly _records: Map<any, ProviderRecord>;

    private constructor() {
        this._records = new Map<any, ProviderRecord>();
    }

    static create(): Injector {
        return new Injector();
    }

    static checkInjectable(token: TConstructor): boolean {
        const injectable = Reflect.getMetadata(INJECTABLE_FLAG, token) === true;
        if (!injectable) {
            throw new VelayError(`${token.name} is not injectable, do you forgot add the 'Injectable' decorator?`);
        }

        return true;
    }

    registerProvider(...providers: ProviderRecord[]): this {
        providers.forEach(provider => {
            if (this._records.has(provider.token)) {
                Debugger.warn(`Provider of ${provider.token.name} has been registered.`);
            }
            this._records.set(provider.token, provider);
        });
        return this;
    }

    resolve<T>(token: TConstructor<T>): T {
        Injector.checkInjectable(token);
        // TODO maybe constuctor with 0 params can be resolved.
        // const subParamTypes = Reflect.getMetadata('design:paramtypes', token) || [];
        // if (subParamTypes.length > 0) {
        //     return null;
        // }

        const record = this._records.get(token);
        if (!record) {
            throw new VelayError(`${token.name} is not registered in injector`);
        }

        try {
            return this._resolveToken<T>(record);
        } catch (e) {
            if (!(e instanceof Error)) {
                // tslint:disable-next-line:no-ex-assign
                e = new VelayError(e);
            }
            if (!(e instanceof VelayError)) {
                // tslint:disable-next-line:no-ex-assign
                e = new VelayError(e.message);
            }
            if (record.value === CIRCULAR) {
                record.value = EMPTY;
            }
            throw e;
        }
    }

    _resolveToken<T>(record: ProviderRecord): T {
        const fn = record.token;
        let value = record.value;
        if (value === CIRCULAR) {
            throw new VelayError('Circular dependency');
        } else if (value === EMPTY) {
            record.value = CIRCULAR;
            let deps = [];
            const paramTypes = Reflect.getMetadata('design:paramtypes', record.token) || [];
            for (let i = 0; i < paramTypes.length; i++) {
                const paramType = paramTypes[i];
                deps.push(this.resolve<any>(paramType));
            }
            value = new (fn as any)(...deps);
            if (record.cacheable) {
                record.value = value;
            }
        }

        return value;
    }

    has(token: TConstructor): boolean {
        return this._records.has(token);
    }
}
