import { TConstructor, ProviderRecord } from '../../types/index';

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

    get<T>(token: TConstructor<T>): T {
        //
    }

    has(token: TConstructor): boolean {
        //
    }
}
