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

export default {
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
