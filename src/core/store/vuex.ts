import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default class Store<T> extends Vuex.Store<T> {}

type ObjectDescriptor<D, M> = M & ThisType<D & M>;

class RootStore<T> extends Store<ObjectDescriptor<T, { module: number }>> {
    module1: ModuleStore;

    test() {}
}

class ModuleStore<T> extends Store<T> {
    state = {
        module: 1
    };
}
