import Vue, { ComponentOptions } from 'vue';
import { mapState, mapGetters, mapActions, mapMutations, Store } from 'vuex';
import { BaseKV } from '../../types/internal';
import { DecoratedClass } from '../../lib/vue-class-component/declarations';

const MapHelperMap: BaseKV = {
    State: mapState,
    Getter: mapGetters,
    Action: mapActions,
    Mutation: mapMutations
};

let _uid = 1;

/**
 * Vuex store class
 */
export default class StoreService {
    // tslint:disable-next-line:variable-name
    public static __local_decorators__: { key: string; type: string; descriptor?: any }[] = [];

    public _storeBinded: boolean = false;

    public _store: Store<any> | undefined;

    public _storeNamespace: string;

    constructor() {
        this._storeNamespace = `StoreServiceNamespace${_uid++}`;
    }
}

export function handleStoreServiceBinding(key: string, store: StoreService, vm: Vue) {
    if (!isStoreService(store)) {
        return;
    }
    if (store._storeBinded) {
        return;
    }
    store._storeBinded = true;
    console.log('handleStoreServiceBinding', key, store);
    if (!StoreService.__local_decorators__ || StoreService.__local_decorators__.length === 0) {
        return;
    }
    const Ctor = typeof vm === 'function' ? (vm as DecoratedClass) : (vm.constructor as DecoratedClass);
    // if (!Ctor.__decorators__) {
    //     Ctor.__decorators__ = [];
    // }

    // if (options.store) {
    //     this.$store = typeof options.store === 'function'
    //       ? options.store()
    //       : options.store;
    //   } else if (options.parent && options.parent.$store) {
    //     this.$store = options.parent.$store;
    //   }

    if (!Ctor.$store) {
        Ctor.$store = new Store({
            state: {}
        });
    }

    store._store = Ctor.$store;
    // if (typeof index !== 'number') {
    //     index = undefined;
    // }
    // TODO1
    // collect state, getters, actions, mutations to a storeoptions object
    const state: BaseKV = {};
    const getters: BaseKV = {};
    const mutations: BaseKV = {};
    StoreService.__local_decorators__.forEach(decoratorDesc => {
        const key = decoratorDesc.key;
        switch (decoratorDesc.type) {
            case 'State':
                state[key] = (store as any)[key];
                mutations[`_${key}_mutation`] = (state: BaseKV, payload?: any) => {
                    state[key] = payload;
                };
                Object.defineProperty(store, key, {
                    get() {
                        return Ctor.$store.state[store._storeNamespace][key];
                    },
                    set(value) {
                        return Ctor.$store.commit(`${store._storeNamespace}/_${key}_mutation`, value);
                    }
                });
                break;
            case 'Getter':
                break;
            case 'Action':
                break;
            case 'Mutation':
                break;
            default:
                return;
        }
    });

    // TODO2
    Ctor.$store!.registerModule(store._storeNamespace, {
        namespaced: true,
        state,
        getters,
        actions: {},
        mutations
    });

    // TODO3
    // mapstate, methods to storeservice

    // store.__decorators__.forEach(decoratorDesc => {
    //     let bindTo = decoratorDesc.type === 'State' || decoratorDesc.type === 'Getter' ? 'computed' : 'methods';
    //     Ctor.__decorators__!.push((options: any) => {
    //         if (!options[bindTo]) {
    //             options[bindTo] = {};
    //         }
    //         const mapObject = { [decoratorDesc.key]: key };
    //         options[bindTo][key] = MapHelperMap[decoratorDesc.type](store._storeNamespace, mapObject)[key];
    //     });
    // });
}

export function isStoreService(instance?: any) {
    return instance && instance instanceof StoreService;
}
