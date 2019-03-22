import Vue, { ComponentOptions } from 'vue';
import { Inject, Model, Prop, Emit, Provide, Watch } from 'vue-property-decorator';
import { VueClass } from '../../lib/vue-class-component/declarations';
import { componentFactory, $internalHooks } from '../../lib/vue-class-component/component';
import { getInjectedConstructor } from '../utils/reflection';

interface IComponentOptions extends ComponentOptions<Vue> {}

function Component<V extends Vue>(options: IComponentOptions & ThisType<V>): <VC extends VueClass<V>>(target: VC) => VC;
function Component<VC extends VueClass<Vue>>(target: VC): VC;
function Component(options: IComponentOptions | VueClass<Vue>): any {
    if (typeof options === 'function') {
        const target = getInjectedConstructor(options);
        if (!target) {
            throw new Error(`${options.name} dependency injection failed`);
        }
        (target as any).__decorators__ = (options as any).__decorators__;
        return componentFactory(target as any, {});
    }
    return function(Component: VueClass<Vue>) {
        const target = getInjectedConstructor(Component);
        if (!target) {
            throw new Error(`${Component.name} dependency injection failed`);
        }
        (target as any).__decorators__ = (Component as any).__decorators__;
        return componentFactory(target as any, options);
    };
}

function registerHooks(keys: string[]): void {
    $internalHooks.push(...keys);
}

Component.registerHooks = registerHooks;

export { Inject, Model, Prop, Emit, Provide, Watch, Component, registerHooks };
