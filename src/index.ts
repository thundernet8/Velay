import Vue from 'vue';
import Vuex from 'vuex';
import velayPlugin from './core/plugin';

Vue.use(Vuex);
Vue.use(velayPlugin);

declare var window: any;

/**
 * Decorators
 */
import { Inject, Model, Prop, Emit, Provide, Watch, Component, registerHooks } from './core/component/decotator';
import Injectable from './core/injection/injectable';
import { State, Getter, Action, Mutation } from './core/store/decorator';

/**
 * Base Component Class
 */
import VueComponent from './core/component/vue-component';

/**
 * Injector
 */
import StaticInjector from './core/injection/staticInjector';
import Injector from './core/injection/injector';

/**
 * Config
 */
import Config from './core/config';

/**
 * Store Service
 */
import StoreService from './core/store/vuex';

export {
    Inject,
    Model,
    Prop,
    Emit,
    Provide,
    Watch,
    Component,
    registerHooks,
    State,
    Getter,
    Action,
    Mutation,
    Injectable,
    VueComponent,
    Vue,
    StaticInjector,
    Injector,
    StoreService
};

const Velay = {
    Inject,
    Model,
    Prop,
    Emit,
    Provide,
    Watch,
    Component,
    registerHooks,
    State,
    Getter,
    Action,
    Mutation,
    Injectable,
    VueComponent,
    Vue,
    StaticInjector,
    Injector,
    version: '',
    config: {},
    providers: [],
    StoreService
};

Object.defineProperty(Velay, 'config', {
    configurable: false,
    writable: false,
    value: Config
});

Object.defineProperty(Velay, 'version', {
    configurable: false,
    writable: false,
    value: '1.0.2'
});

Object.defineProperty(Velay, 'providers', {
    configurable: false,
    get() {
        return StaticInjector.list();
    }
});

if (typeof window !== 'undefined') {
    window.Velay = Velay;
}

export default Velay;
