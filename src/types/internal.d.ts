export type TConstructor<T = any> = new (...args: any[]) => T;

export interface ProviderRecord {
    token: TConstructor;
    value?: any;
    cacheable?: boolean;
}

export interface InjectableOptions {
    cacheable: boolean;
}

export interface BaseKV {
    [key: string]: any;
}
