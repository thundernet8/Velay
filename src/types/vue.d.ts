import Vue from 'vue';

import { OmitFunction } from './helper';

type U<T extends any[]> = T[number];

interface AnyStore {
    [key: string]: any;
}

type NoneFunctionKeys<T> = { [P in keyof T]: T[P] extends Function ? never : P }[keyof T];
type FunctionKeys<T> = { [P in keyof T]: T[P] extends Function ? P : never }[keyof T];
type OmitFunction<T> = Pick<T, Exclude<keyof T, NoneFunctionKeys<T>>>;
type EmitFunction<T> = Pick<T, Exclude<keyof T, FunctionKeys<T>>>;
type Include<T, K extends String> = Exclude<keyof T, Exclude<keyof T, K>>;
type Prop<T, K extends keyof T> = T[K];
type OmitState<T> = Pick<
    T,
    Exclude<
        keyof T,
        'state' | 'actions' | 'mutations' | 'modules' | 'getters' | 'context' | 'namespaced' | FunctionKeys<T>
    >
>;

export class GenericVue<R = AnyStore, M = AnyStore> extends Vue {
    $store: OmitFunction<R> & OmitFunction<M>;
    $state: Prop<M, Include<M, 'state'>> & OmitState<M>;
    $rootState: Prop<R, Include<R, 'state'>> & OmitState<R> & { [key: string]: any };
}
