import Vue from 'vue';
import { Store } from 'vuex';
import { BaseKV } from '../../types/internal';
import { isFunction } from '../utils/index';
import Debugger from '../utils/debugger';

let _uid = 1;

/**
 * Vuex store class
 */
export default class StoreService {
    // tslint:disable-next-line:variable-name
    public static __local_decorators__: { key: string; type: string; descriptor?: any }[] = [];

    public _storeBinded: boolean = false;

    public _store: Store<any> | undefined;

    public _storeNamespace: string | undefined;

    constructor() {
        const uid = _uid++;
        Object.defineProperty(this, '_storeNamespace', {
            enumerable: false,
            configurable: false,
            get() {
                return `${this.constructor.name || 'StoreService'}Namespace${uid}`;
            }
        });
    }
}

export function handleStoreServiceBinding(service: StoreService, vm: Vue) {
    if (!isStoreService(service)) {
        return;
    }
    if (service._storeBinded) {
        return;
    }
    service._storeBinded = true;

    if (!StoreService.__local_decorators__ || StoreService.__local_decorators__.length === 0) {
        return;
    }

    let vuexStore = (vm as any).$velayStore;
    if (!vuexStore) {
        vuexStore = (vm as any).$velayStore = new Store({
            state: {}
        });
    }

    service._store = vuexStore;

    // collect state, getters, actions, mutations to a storeoptions object
    const state: BaseKV = {};
    const getters: BaseKV = {};
    const mutations: BaseKV = {};
    StoreService.__local_decorators__.forEach(decoratorDesc => {
        const { key, descriptor } = decoratorDesc;
        switch (decoratorDesc.type) {
            case 'State':
                state[key] = (service as any)[key];
                mutations[`_${key}_mutation`] = (state: BaseKV, payload?: any) => {
                    state[key] = payload;
                };
                Object.defineProperty(service, key, {
                    get() {
                        return vuexStore.state[service._storeNamespace!][key];
                    },
                    set(value) {
                        return vuexStore.commit(`${service._storeNamespace}/_${key}_mutation`, value);
                    }
                });
                break;
            case 'Getter':
                if (descriptor) {
                    const method = descriptor.get;
                    if (isFunction(method)) {
                        getters[key] = () => method.call(service);
                        Object.defineProperty(service, key, {
                            get() {
                                return vuexStore.getters[`${service._storeNamespace}/${key}`];
                            }
                        });
                    }
                }
                break;
            case 'Action':
                // no need
                break;
            case 'Mutation':
                // no need
                break;
            default:
                return;
        }
    });

    // bind methods to instance
    const proto = Object.getPrototypeOf(service);
    if (proto.__proto__ !== StoreService.prototype) {
        Debugger.warn(`It's not recommended for multiple inheritance of 'StoreService'`);
    }
    const descriptors = Object.getOwnPropertyDescriptors(proto);
    Object.keys(descriptors).forEach(key => {
        const descriptor = descriptors[key];
        if (descriptor.value && isFunction(descriptor.value) && key !== 'constructor') {
            Object.defineProperty(service, key, {
                ...descriptor,
                value: descriptor.value.bind(service)
            });
        }
    });

    // register vuex module for this dataservice
    vuexStore.registerModule(service._storeNamespace, {
        namespaced: true,
        state,
        getters,
        actions: {},
        mutations
    });
}

export function isStoreService(instance?: any) {
    return instance && instance instanceof StoreService;
}
