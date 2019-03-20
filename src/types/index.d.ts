export type TConstructor<T = any> = new (...args: any[]) => T;

export interface ProviderRecord {
    token: TConstructor;
    value: any;
    disabelCache: boolean;
}

export { NewVue as Vue } from './vue';
