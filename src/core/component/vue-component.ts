import Vue from 'vue';
import { InternalJSX } from '../../types/jsx';

// type Readonly<T> = { readonly [P in keyof T]: T[P] };

export default class VueComponent<T> extends Vue {
    // tslint:disable-next-line:variable-name
    private _props_: InternalJSX.ElementAttrs<T> = {} as any;
}
