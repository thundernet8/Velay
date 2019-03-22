import Vue from 'vue';

/**
 * Decorators
 */
import { Inject, Model, Prop, Emit, Provide, Watch, Component, registerHooks } from './core/component/decotator';
import Injectable from './core/injection/injectable';

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

export {
    Inject,
    Model,
    Prop,
    Emit,
    Provide,
    Watch,
    Component,
    registerHooks,
    Injectable,
    VueComponent,
    Vue,
    StaticInjector,
    Injector
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
    Injectable,
    VueComponent,
    Vue,
    StaticInjector,
    Injector,
    version: '',
    config: {},
    providers: []
};

Object.defineProperty(Velay, 'config', {
    configurable: false,
    writable: false,
    value: Config
});

Object.defineProperty(Velay, 'version', {
    configurable: false,
    writable: false,
    value: '0.0.1'
});

Object.defineProperty(Velay, 'providers', {
    configurable: false,
    get() {
        return StaticInjector.list();
    }
});

export default Velay;
