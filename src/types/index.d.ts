import Vue, { VueConstructor, VNode, ComponentOptions, PropOptions, WatchOptions } from 'vue';
import { InjectKey } from 'vue/types/options';
import { InternalJSX } from './jsx';
import { TConstructor, InjectableOptions, ProviderRecord } from './internal';
import { VueClass } from '../lib/vue-class-component/declarations';

export = Velay;

export as namespace Velay;

declare namespace Velay {
    interface VueComponentLifeCycle<T> {
        /**
         * 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用
         */
        beforeCreate(): void;

        /**
         * 在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见
         */
        created(): void;

        /**
         * 在挂载开始之前被调用：相关的 render 函数首次被调用。
         * Note: 该钩子在服务器端渲染期间不被调用
         */
        beforeMount(): void;

        /**
         * el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$el 也在文档内。注意 mounted 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 vm.$nextTick 替换掉 mounted
         * Note: 该钩子在服务器端渲染期间不被调用
         */
        mounted(): void;

        /**
         * 数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。
         * Note: 该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务端进行
         */
        beforeUpdate(): void;

        /**
         * 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
         * 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或 watcher 取而代之。注意 updated 不会承诺所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕，可以用 vm.$nextTick 替换掉 updated
         * Note: 该钩子在服务器端渲染期间不被调用
         */
        updated(): void;

        /**
         * keep-alive 组件激活时调用。
         * Note: 该钩子在服务器端渲染期间不被调用
         */
        activated(): void;

        /**
         * keep-alive 组件停用时调用
         * Note: 该钩子在服务器端渲染期间不被调用
         */
        deactivated(): void;

        /**
         * 实例销毁之前调用。在这一步，实例仍然完全可用
         * Note: 该钩子在服务器端渲染期间不被调用
         */
        beforeDestroy(): void;

        /**
         * Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁
         * Note: 该钩子在服务器端渲染期间不被调用
         */
        destroyed(): void;

        /**
         * Vue 2.5.0+
         * 当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播
         */
        errorCaptured(err: Error, vm: ThisType<VueComponent<T>>, info: string): boolean | void;

        // TODO 2.6+
    }

    export function Inject(
        options?:
            | {
                  from?: InjectKey;
                  default?: any;
              }
            | InjectKey
    ): PropertyDecorator;

    export function Provide(key?: string | symbol): PropertyDecorator;

    export function Model(event?: string, options?: PropOptions | TConstructor[] | TConstructor): PropertyDecorator;

    export function Prop(options?: PropOptions | TConstructor[] | TConstructor): PropertyDecorator;

    export function Watch(path: string, options?: WatchOptions): MethodDecorator;

    export function Emit(event?: string): MethodDecorator;

    export function Component<V extends Vue>(
        options: ComponentOptions<V> & ThisType<V>
    ): <VC extends VueClass<V>>(target: VC) => VC;
    export function Component<VC extends VueClass<Vue>>(target: VC): VC;

    export function registerHooks(keys: string[]): void;

    export function Injectable(options: InjectableOptions): (target: any) => any;
    export function Injectable(target: any): any;

    export class StaticInjector {
        static registerProvider(...providers: ProviderRecord[]): void;

        static resolve<T>(token: TConstructor<T>): T;

        static has(token: TConstructor): boolean;

        static toString(): string;
    }

    export class Injector {
        static create(): Injector;

        static checkInjectable(token: TConstructor): boolean;

        registerProvider(...providers: ProviderRecord[]): Injector;

        resolve<T>(token: TConstructor<T>): T;

        has(token: TConstructor): boolean;

        toString(): string;
    }

    export interface VueComponent<T> extends VueComponentLifeCycle<T> {
        $parent: Vue;
        $children: Vue[];
    }

    export class VueComponent<T> extends Vue {
        _props_: InternalJSX.ElementAttrs<T>;

        [propOrDataName: string]: any;
    }
}
