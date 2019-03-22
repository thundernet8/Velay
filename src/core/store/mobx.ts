import Vue from 'vue';
import { isObservable, Reaction } from 'mobx';
import { DefaultData } from 'vue/types/options';
import { VueClass } from '../../lib/vue-class-component/declarations';

// tslint:disable-next-line:no-empty
const noop = () => {};
const DISPOSE_REACTIVE = 'Velay:DISPOSE_REACTIVE';

// from mobx-vue

export function collectData(vm: Vue, data?: DefaultData<Vue>) {
    const dataValues = typeof data === 'function' ? data.call(vm, vm) : data || {};
    const filteredValues = Object.keys(dataValues).reduce((prev: any, curr) => {
        const value = dataValues[curr];
        if (isObservable(value)) {
            Object.defineProperty(vm, curr, {
                configurable: true,
                get() {
                    return value;
                },
                set() {
                    // ignore vue set
                }
            });
        } else {
            prev[curr] = value;
        }

        return prev;
    }, {});

    return filteredValues;
}

export function reactiveComponent(name: string, Component: VueClass<Vue>) {
    const { $mount, $destory } = Component.prototype;
    Component.prototype.$mount = function(...args: any[]) {
        const vm = this;
        let mounted = false;
        let originalRender: any;
        vm[DISPOSE_REACTIVE] = noop;

        const reactiveRender = () => {
            reaction.track(() => {
                if (!mounted) {
                    $mount.call(vm, ...args);
                    mounted = true;
                    originalRender = vm._watcher.getter;
                    vm._watcher.getter = reactiveRender;
                } else {
                    originalRender.call(vm, vm);
                }
            });

            return vm;
        };

        const reaction = new Reaction(`${name}.render()`, reactiveRender);

        vm[DISPOSE_REACTIVE] = reaction.getDisposer();

        return reactiveRender();
    };

    Component.prototype.$destory = function(vm: any) {
        vm[DISPOSE_REACTIVE]();
        $destory.apply(vm);
    };

    return Component;
}
