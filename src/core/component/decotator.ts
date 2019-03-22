import Vue, { ComponentOptions } from 'vue';
import { Inject, Model, Prop, Emit, Provide, Watch } from 'vue-property-decorator';
import { VueClass } from '../../lib/vue-class-component/declarations';
import { componentFactory, $internalHooks } from '../../lib/vue-class-component/component';
import { getInjectedConstructor } from '../utils/reflection';
import { collectData, reactiveComponent } from '../store/mobx';

interface IComponentOptions extends ComponentOptions<Vue> {}

let componentId = 1;

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

function Component<V extends Vue>(options: IComponentOptions & ThisType<V>): <VC extends VueClass<V>>(target: VC) => VC;
function Component<VC extends VueClass<Vue>>(target: VC): VC;
function Component(options: IComponentOptions | VueClass<Vue>): any {
    const originalOptions = typeof options === 'function' ? (options as any).options : options;
    const combineOptions = {
        ...originalOptions,
        data: (vm: Vue) => collectData(vm, originalOptions.data),
        _Ctor: {}
    };
    if (typeof options === 'function') {
        const name = getComponentName(options);
        const target = getInjectedConstructor(options);
        if (!target) {
            throw new Error(`${name} dependency injection failed`);
        }
        (target as any).__decorators__ = (options as any).__decorators__;
        return reactiveComponent(name, componentFactory(target as any, { ...combineOptions, name }));
    }
    return function(Component: VueClass<Vue>) {
        const name = getComponentName(options, Component);
        const target = getInjectedConstructor(Component);
        if (!target) {
            throw new Error(`${Component.name} dependency injection failed`);
        }
        (target as any).__decorators__ = (Component as any).__decorators__;
        return reactiveComponent(name, componentFactory(target as any, { ...combineOptions, name }));
    };
}

function registerHooks(keys: string[]): void {
    $internalHooks.push(...keys);
}

Component.registerHooks = registerHooks;

export { Inject, Model, Prop, Emit, Provide, Watch, Component, registerHooks };
