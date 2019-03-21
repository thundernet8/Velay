'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var vuePropertyDecorator = require('vue-property-decorator');
var Vue = _interopDefault(require('vue'));
require('reflect-metadata');

// The rational behind the verbose Reflect-feature check below is the fact that there are polyfills
// which add an implementation for Reflect.defineMetadata but not for Reflect.getOwnMetadataKeys.
// Without this check consumers will encounter hard to track down runtime errors.
const reflectionIsSupported = typeof Reflect !== 'undefined' && Reflect.defineMetadata && Reflect.getOwnMetadataKeys;
function copyReflectionMetadata(to, from) {
    forwardMetadata(to, from);
    Object.getOwnPropertyNames(from.prototype).forEach(key => {
        forwardMetadata(to.prototype, from.prototype, key);
    });
    Object.getOwnPropertyNames(from).forEach(key => {
        forwardMetadata(to, from, key);
    });
}
function forwardMetadata(to, from, propertyKey) {
    const metaKeys = propertyKey ? Reflect.getOwnMetadataKeys(from, propertyKey) : Reflect.getOwnMetadataKeys(from);
    metaKeys.forEach(metaKey => {
        const metadata = propertyKey
            ? Reflect.getOwnMetadata(metaKey, from, propertyKey)
            : Reflect.getOwnMetadata(metaKey, from);
        if (propertyKey) {
            Reflect.defineMetadata(metaKey, metadata, to, propertyKey);
        }
        else {
            Reflect.defineMetadata(metaKey, metadata, to);
        }
    });
}

const fakeArray = { __proto__: [] };
const hasProto = fakeArray instanceof Array;
function isPrimitive(value) {
    const type = typeof value;
    return value == null || (type !== 'object' && type !== 'function');
}
function warn(message) {
    if (typeof console !== 'undefined') {
        console.warn('[vue-class-component] ' + message);
    }
}

function collectDataFromConstructor(vm, Component) {
    // override _init to prevent to init as Vue instance
    const originalInit = Component.prototype._init;
    Component.prototype._init = function () {
        // proxy to actual vm
        const keys = Object.getOwnPropertyNames(vm);
        // 2.2.0 compat (props are no longer exposed as self properties)
        if (vm.$options.props) {
            for (const key in vm.$options.props) {
                if (!vm.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
        }
        keys.forEach(key => {
            if (key.charAt(0) !== '_') {
                Object.defineProperty(this, key, {
                    get: () => vm[key],
                    set: value => {
                        vm[key] = value;
                    },
                    configurable: true
                });
            }
        });
    };
    // should be acquired class property values
    const data = new Component();
    // restore original _init to avoid memory leak (#209)
    Component.prototype._init = originalInit;
    // create plain data object
    const plainData = {};
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
            plainData[key] = data[key];
        }
    });
    if (process.env.NODE_ENV !== 'production') {
        if (!(Component.prototype instanceof Vue) && Object.keys(plainData).length > 0) {
            warn('Component class must inherit Vue or its descendant class ' + 'when class property is used.');
        }
    }
    return plainData;
}

const $internalHooks = [
    'data',
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeDestroy',
    'destroyed',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'render',
    'errorCaptured',
    'serverPrefetch' // 2.6
];
function componentFactory(Component, options = {}) {
    options.name = options.name || Component._componentTag || Component.name;
    // prototype props.
    const proto = Component.prototype;
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === 'constructor') {
            return;
        }
        // hooks
        if ($internalHooks.indexOf(key) > -1) {
            options[key] = proto[key];
            return;
        }
        const descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (descriptor.value !== void 0) {
            // methods
            if (typeof descriptor.value === 'function') {
                (options.methods || (options.methods = {}))[key] = descriptor.value;
            }
            else {
                // typescript decorated data
                (options.mixins || (options.mixins = [])).push({
                    data() {
                        return { [key]: descriptor.value };
                    }
                });
            }
        }
        else if (descriptor.get || descriptor.set) {
            // computed properties
            (options.computed || (options.computed = {}))[key] = {
                get: descriptor.get,
                set: descriptor.set
            };
        }
    });
    // add data hook to collect class properties as Vue instance's data
    (options.mixins || (options.mixins = [])).push({
        data() {
            return collectDataFromConstructor(this, Component);
        }
    });
    // decorate options
    const decorators = Component.__decorators__;
    if (decorators) {
        decorators.forEach(fn => fn(options));
        delete Component.__decorators__;
    }
    // find super
    const superProto = Object.getPrototypeOf(Component.prototype);
    const Super = superProto instanceof Vue ? superProto.constructor : Vue;
    const Extended = Super.extend(options);
    forwardStaticMembers(Extended, Component, Super);
    if (reflectionIsSupported) {
        copyReflectionMetadata(Extended, Component);
    }
    return Extended;
}
const reservedPropertyNames = [
    // Unique id
    'cid',
    // Super Vue constructor
    'super',
    // Component options that will be used by the component
    'options',
    'superOptions',
    'extendOptions',
    'sealedOptions',
    // Private assets
    'component',
    'directive',
    'filter'
];
function forwardStaticMembers(Extended, Original, Super) {
    // We have to use getOwnPropertyNames since Babel registers methods as non-enumerable
    Object.getOwnPropertyNames(Original).forEach(key => {
        // `prototype` should not be overwritten
        if (key === 'prototype') {
            return;
        }
        // Some browsers does not allow reconfigure built-in properties
        const extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key);
        if (extendedDescriptor && !extendedDescriptor.configurable) {
            return;
        }
        const descriptor = Object.getOwnPropertyDescriptor(Original, key);
        // If the user agent does not support `__proto__` or its family (IE <= 10),
        // the sub class properties may be inherited properties from the super class in TypeScript.
        // We need to exclude such properties to prevent to overwrite
        // the component options object which stored on the extended constructor (See #192).
        // If the value is a referenced value (object or function),
        // we can check equality of them and exclude it if they have the same reference.
        // If it is a primitive value, it will be forwarded for safety.
        if (!hasProto) {
            // Only `cid` is explicitly exluded from property forwarding
            // because we cannot detect whether it is a inherited property or not
            // on the no `__proto__` environment even though the property is reserved.
            if (key === 'cid') {
                return;
            }
            const superDescriptor = Object.getOwnPropertyDescriptor(Super, key);
            if (!isPrimitive(descriptor.value) && superDescriptor && superDescriptor.value === descriptor.value) {
                return;
            }
        }
        // Warn if the users manually declare reserved properties
        if (process.env.NODE_ENV !== 'production' && reservedPropertyNames.indexOf(key) >= 0) {
            warn(`Static property name '${key}' declared on class '${Original.name}' ` +
                'conflicts with reserved property name of Vue internal. ' +
                'It may cause unexpected behavior of the component. Consider renaming the property.');
        }
        Object.defineProperty(Extended, key, descriptor);
    });
}

// TODO env and log level
class Debugger {
    static get _prefixedMsg() {
        const datetime = new Date();
        return `[${datetime.toJSON().slice(0, 10)} ${datetime.toTimeString().slice(0, 8)}][Velay:Core] `;
    }
    static _shouldOutput() {
        return true;
    }
    static output(type, args) {
        if (!Debugger._shouldOutput()) {
            return;
        }
        const fn = console[type];
        return fn && fn(Debugger._prefixedMsg, ...args);
    }
    static warn(...args) {
        return Debugger.output('warn', args);
    }
    static log(...args) {
        return Debugger.output('log', args);
    }
    static error(...args) {
        return Debugger.output('error', args);
    }
}

const EMPTY = 'Velay:EMPTY';
const CIRCULAR = 'Velay:CIRCULAR';
const INJECTABLE_FLAG = 'Velay:Injectable';

class VelayError extends Error {
    constructor(msg) {
        const mergedMsg = `[Velay:Core] ${msg || ''}`;
        super(mergedMsg);
    }
}

class Injector {
    constructor() {
        this._records = new Map();
    }
    static create() {
        return new Injector();
    }
    static checkInjectable(token) {
        const injectable = Reflect.getMetadata(INJECTABLE_FLAG, token) === true;
        if (!injectable) {
            throw new VelayError(`${token.name} is not injectable, do you forgot add the 'Injectable' decorator?`);
        }
        return true;
    }
    registerProvider(...providers) {
        providers.forEach(provider => {
            if (this._records.has(provider.token)) {
                Debugger.warn(`Provider of ${provider.token.name} has been registered.`);
            }
            if (provider.value === undefined) {
                provider.value = EMPTY;
            }
            this._records.set(provider.token, provider);
        });
        return this;
    }
    resolve(token) {
        Injector.checkInjectable(token);
        // TODO maybe constuctor with 0 params can be resolved.
        // const subParamTypes = Reflect.getMetadata('design:paramtypes', token) || [];
        // if (subParamTypes.length > 0) {
        //     return null;
        // }
        const record = this._records.get(token);
        if (!record) {
            throw new VelayError(`${token.name} is not registered in injector`);
        }
        try {
            return this._resolveToken(record);
        }
        catch (e) {
            if (!(e instanceof Error)) {
                // tslint:disable-next-line:no-ex-assign
                e = new VelayError(e);
            }
            if (!(e instanceof VelayError)) {
                // tslint:disable-next-line:no-ex-assign
                e = new VelayError(e.message);
            }
            if (record.value === CIRCULAR) {
                record.value = EMPTY;
            }
            throw e;
        }
    }
    _resolveToken(record) {
        const fn = record.token;
        let value = record.value;
        if (value === CIRCULAR) {
            throw new VelayError('Circular dependency');
        }
        else if (value === EMPTY) {
            record.value = CIRCULAR;
            let deps = [];
            const paramTypes = Reflect.getMetadata('design:paramtypes', record.token) || [];
            for (let i = 0; i < paramTypes.length; i++) {
                const paramType = paramTypes[i];
                deps.push(this.resolve(paramType));
            }
            value = new fn(...deps);
            if (record.cacheable) {
                record.value = value;
            }
        }
        return value;
    }
    has(token) {
        return this._records.has(token);
    }
}

class StaticInjector {
    constructor() {
        throw new Error('StaticInjector is not constructable');
    }
    static registerProvider(...providers) {
        return StaticInjector._injector.registerProvider(...providers);
    }
    static resolve(token) {
        return StaticInjector._injector.resolve(token);
    }
    static has(token) {
        return StaticInjector._injector.has(token);
    }
}
StaticInjector._injector = Injector.create();

function getInjectedConstructor(target) {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
    const params = [];
    for (let i = 0; i < paramTypes.length; i++) {
        const paramType = paramTypes[i];
        if (typeof paramType !== 'function') {
            Debugger.warn(`pamameter ${i + 1} of ${target.name} is not a constructor`);
            return null;
        }
        if (paramType === Object || paramType === Function) {
            Debugger.warn(`pamameter ${i + 1} of ${target.name} is not a valid constructor`);
            return null;
        }
        if (!StaticInjector.has(paramType)) {
            Debugger.warn(`${paramType.name} cannot be resolved`);
            const subParamTypes = Reflect.getMetadata('design:paramtypes', paramType) || [];
            if (subParamTypes.length === 0) {
                params.push(new paramType());
            }
            else {
                params.push(undefined);
            }
        }
        else {
            params.push(StaticInjector.resolve(paramType));
        }
    }
    const InjectedConstructor = function () {
        return new target(...params);
    };
    InjectedConstructor.prototype = target.prototype;
    Object.defineProperty(InjectedConstructor, 'name', {
        writable: false,
        configurable: false,
        value: target.name
    });
    return InjectedConstructor;
}

function Component(options) {
    if (typeof options === 'function') {
        const target = getInjectedConstructor(options);
        if (!target) {
            throw new Error(`${options.name} dependency injection failed`);
        }
        target.__decorators__ = options.__decorators__;
        return componentFactory(target, {});
    }
    return function (Component) {
        const target = getInjectedConstructor(Component);
        if (!target) {
            throw new Error(`${Component.name} dependency injection failed`);
        }
        target.__decorators__ = Component.__decorators__;
        return componentFactory(target, options);
    };
}
function registerHooks(keys) {
    $internalHooks.push(...keys);
}
Component.registerHooks = registerHooks;

const DEFAULT_INJECTABLE_OPTIONS = {
    cacheable: true
};
function Injectable(options) {
    let mergedOptions;
    if (typeof options === 'function') {
        mergedOptions = DEFAULT_INJECTABLE_OPTIONS;
        Reflect.defineMetadata(INJECTABLE_FLAG, true, options);
        StaticInjector.registerProvider({
            token: options,
            cacheable: mergedOptions.cacheable,
            value: EMPTY
        });
        return options;
    }
    mergedOptions = Object.assign({}, DEFAULT_INJECTABLE_OPTIONS, options || {});
    return function (target) {
        // const paramTypes = Reflect.getMetadata('design:paramtypes', target);
        Reflect.defineMetadata(INJECTABLE_FLAG, true, target);
        // Reflect.defineMetadata(INJECTION_CACHEABLE_FLAG, mergedOptions.cacheable, target);
        // Reflect.defineMetadata(INJECTED_PARAMS_METADATA_KEY, paramTypes, target);
        StaticInjector.registerProvider({
            token: target,
            cacheable: mergedOptions.cacheable,
            value: EMPTY
        });
    };
}

// type Readonly<T> = { readonly [P in keyof T]: T[P] };
class VueComponent extends Vue {
    constructor() {
        super(...arguments);
        // tslint:disable-next-line:variable-name
        this._props_ = {};
    }
}

/**
 * Decorators
 */
var index = {
    Inject: vuePropertyDecorator.Inject,
    Model: vuePropertyDecorator.Model,
    Prop: vuePropertyDecorator.Prop,
    Emit: vuePropertyDecorator.Emit,
    Provide: vuePropertyDecorator.Provide,
    Watch: vuePropertyDecorator.Watch,
    Component,
    registerHooks,
    Injectable,
    VueComponent,
    StaticInjector,
    Injector
};

exports.default = index;
//# sourceMappingURL=index.js.map
