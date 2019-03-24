import Vue, { ComponentOptions } from 'vue';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { BaseKV } from '../../types/internal';
import { DecoratedClass } from '../../lib/vue-class-component/declarations';

const MapHelperMap: BaseKV = {
    State: mapState,
    Getter: mapGetters,
    Action: mapActions,
    Mutation: mapMutations
};

/**
 * Vuex store class
 */
export default class StoreService {
    // tslint:disable-next-line:variable-name
    public __decorators__: { key: string; type: string; descriptor?: any }[];

    constructor() {
        this.__decorators__ = [];
    }
}

export function handleStoreServiceBinding(key: string, value: StoreService, vm: Vue) {
    if (!(value instanceof StoreService)) {
        return;
    }
    console.log('handleStoreServiceBinding', key, value);
    if (!value.__decorators__ || value.__decorators__.length === 0) {
        return;
    }
    const Ctor = typeof vm === 'function' ? (vm as DecoratedClass) : (vm.constructor as DecoratedClass);
    if (!Ctor.__decorators__) {
        Ctor.__decorators__ = [];
    }
    // if (typeof index !== 'number') {
    //     index = undefined;
    // }
    value.__decorators__.forEach(decoratorDesc => {
        let bindTo = decoratorDesc.type === 'State' || decoratorDesc.type === 'Getter' ? 'computed' : 'methods';
        Ctor.__decorators__!.push((options: any) => {
            if (!options[bindTo]) {
                options[bindTo] = {};
            }
            const mapObject = { [decoratorDesc.key]: key };
            options[bindTo][key] = MapHelperMap[decoratorDesc.type](mapObject)[key];
        });
    });
}
