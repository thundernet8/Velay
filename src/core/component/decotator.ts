import Vue, { ComponentOptions } from 'vue';
import { Inject, Model, Prop, Emit, Provide, Watch } from 'vue-property-decorator';
import { VueClass } from '../../lib/vue-class-component/declarations';
import { componentFactory, $internalHooks } from '../../lib/vue-class-component/component';
import VueClassComponent from '../../lib/vue-class-component/index';
import { TConstructor } from '../../types/index';

interface IComponentOptions extends ComponentOptions<Vue> {}

function Component<V extends Vue>(options: IComponentOptions & ThisType<V>): <VC extends VueClass<V>>(target: VC) => VC;
function Component<VC extends VueClass<Vue>>(target: VC): VC;
function Component(options: IComponentOptions | VueClass<Vue>): any {
    if (typeof options === 'function') {
        // TODO 生成注入了依赖的constructor
        return componentFactory(options);
    }
    return function(Component: VueClass<Vue>) {
        return componentFactory(Component, options);
    };
}

Component.registerHooks = function registerHooks(keys: string[]): void {
    $internalHooks.push(...keys);
};
