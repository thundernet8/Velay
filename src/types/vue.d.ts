import Vue from 'vue';

import { OmitFunction } from './helper';

interface AnyStore {
    [key: string]: any;
}

type U<T extends any[]> = T[number];

export class NewVue<R = AnyStore, M = AnyStore, MS extends any[] = AnyStore[]> extends Vue {
    $store: OmitFunction<R> & OmitFunction<M> & U<MS>;
}
