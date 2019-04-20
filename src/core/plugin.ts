import Vue from 'vue';
import { VueConstructor } from 'vue/types/vue';
import { Store } from 'vuex';
import { handleStoreServiceBinding, isStoreService } from './store/vuex';
import { componentInstanceMap } from './component/decotator';
import { isFunction } from './utils/index';

let velayStore: Store<any>;
const vueInstance = new Vue();

const plugin = {
    install(_Vue: VueConstructor) {
        _Vue.mixin({
            beforeCreate() {
                const options = this.$options;

                // store injection
                if (!velayStore) {
                    if (options.store) {
                        velayStore = typeof options.store === 'function' ? (options as any).store() : options.store;
                    } else if (options.parent && options.parent.$velayStore) {
                        velayStore = options.parent.$velayStore;
                    } else if (options.parent && options.parent.$store) {
                        velayStore = options.parent.$store;
                    }
                }

                this.$velayStore = velayStore;

                // service injection
                const vid = (this.$options as any)._vid;
                const instance = componentInstanceMap[vid];
                if (!instance) {
                    return;
                }

                const simpleInstance = instance.__proto__ ? Object.create(null) : instance;
                const vuePropKeys = Object.getOwnPropertyNames(vueInstance);
                const paramKeys = Object.getOwnPropertyNames(instance).filter(k => !vuePropKeys.includes(k));
                paramKeys.forEach(key => {
                    // auto injected services must be functions or customized store service
                    if (isFunction(instance[key]) || isStoreService(instance[key])) {
                        handleStoreServiceBinding(instance[key], this);
                        (this as any)[key] = instance[key];
                        simpleInstance[key] = instance[key];
                    }
                });

                // dispose instance
                componentInstanceMap[vid] = simpleInstance;
            }
        });
    }
};

export default plugin;
