/**
 * Decorators
 */
import { Inject, Model, Prop, Emit, Provide, Watch, Component, registerHooks } from '../core/component/decotator';
import Injectable from './injection/injectable';

/**
 * Base Component Class
 */
import VueComponent from './component/vue-component';

/**
 * Injector
 */
import StaticInjector from './injection/staticInjector';
import Injector from './injection/injector';

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
    StaticInjector,
    Injector
};
