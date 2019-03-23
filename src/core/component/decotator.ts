import Vue, { ComponentOptions } from 'vue';
import { Inject, Model, Prop, Emit, Provide, Watch } from 'vue-property-decorator';
import { VueClass } from '../../lib/vue-class-component/declarations';
import { componentFactory, $internalHooks } from '../../lib/vue-class-component/component';
import { getInjectedConstructor } from '../utils/reflection';
import { collectData, reactiveComponent } from '../store/mobx';
import { TConstructor } from '../../types/internal';

interface IComponentOptions extends ComponentOptions<Vue> {}

let componentId = 1;

// tslint:disable-next-line:no-empty
const noop = () => {};

function getComponentName(options: IComponentOptions | VueClass<Vue>, component?: VueClass<Vue>) {
    if (typeof options === 'object' && options.name) {
        return options.name;
    }
    if (typeof options === 'function' && (options as any).options && (options as any).options.name) {
        return (options as any).options.name;
    }
    let klass: VueClass<Vue> = (component || options) as VueClass<Vue>;
    const constructorName = klass.name || (klass.constructor && Component.constructor.name);
    return constructorName || `VueComponent${componentId++}`;
}

function injectService(Component: TConstructor) {
    const instance = new Component();
    const vueInstance = new Vue();
    Vue.mixin({
        beforeCreate() {
            const vuePropKeys = Object.getOwnPropertyNames(vueInstance);
            const paramKeys = Object.getOwnPropertyNames(instance).filter(k => !vuePropKeys.includes(k));
            paramKeys.forEach(key => {
                // auto injected services must be functions
                if (typeof instance[key] === 'function') {
                    (this as any)[key] = instance[key];
                }
            });
        }
    });
}

function assembleComponent(Component: VueClass<Vue>, options: IComponentOptions) {
    const name = getComponentName(options, Component);
    const target = getInjectedConstructor(Component);
    if (!target) {
        throw new Error(`${Component.name} dependency injection failed`);
    }
    (target as any).__decorators__ = (options as any).__decorators__;
    injectService(target);
    return reactiveComponent(name, componentFactory(target as any, { ...options, name }));
}

function Component<V extends Vue>(options: IComponentOptions & ThisType<V>): <VC extends VueClass<V>>(target: VC) => VC;
function Component<VC extends VueClass<Vue>>(target: VC): VC;
function Component(options: IComponentOptions | VueClass<Vue>): any {
    // const originalOptions = typeof options === 'function' ? (options as any).options : options;
    // const combineOptions = {
    //     ...originalOptions,
    //     // data: (vm: Vue) => collectData(vm, originalOptions.data),
    //     _Ctor: {}
    // };
    if (typeof options === 'function') {
        return assembleComponent(options, { _Ctor: {} } as any);
    }
    return function(Component: VueClass<Vue>) {
        return assembleComponent(Component, { ...options, _Ctor: {} } as any);
    };
}

function registerHooks(keys: string[]): void {
    $internalHooks.push(...keys);
}

Component.registerHooks = registerHooks;

export { Inject, Model, Prop, Emit, Provide, Watch, Component, registerHooks };
