import Vue from 'vue';
export { default as Vue } from 'vue';
import Vuex, { Store } from 'vuex';
import { Inject, Model, Prop, Emit, Provide, Watch } from 'vue-property-decorator';
export { Inject, Model, Prop, Emit, Provide, Watch } from 'vue-property-decorator';
import 'reflect-metadata';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

// The rational behind the verbose Reflect-feature check below is the fact that there are polyfills
// which add an implementation for Reflect.defineMetadata but not for Reflect.getOwnMetadataKeys.
// Without this check consumers will encounter hard to track down runtime errors.
var reflectionIsSupported = typeof Reflect !== 'undefined' && Reflect.defineMetadata && Reflect.getOwnMetadataKeys;
function copyReflectionMetadata(to, from) {
    forwardMetadata(to, from);
    Object.getOwnPropertyNames(from.prototype).forEach(function (key) {
        forwardMetadata(to.prototype, from.prototype, key);
    });
    Object.getOwnPropertyNames(from).forEach(function (key) {
        forwardMetadata(to, from, key);
    });
}
function forwardMetadata(to, from, propertyKey) {
    var metaKeys = propertyKey ? Reflect.getOwnMetadataKeys(from, propertyKey) : Reflect.getOwnMetadataKeys(from);
    metaKeys.forEach(function (metaKey) {
        var metadata = propertyKey
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

var fakeArray = { __proto__: [] };
var hasProto = fakeArray instanceof Array;
function isPrimitive(value) {
    var type = typeof value;
    return value == null || (type !== 'object' && type !== 'function');
}
function warn(message) {
    if (typeof console !== 'undefined') {
        console.warn('[vue-class-component] ' + message);
    }
}

function isFunction(target) {
    return typeof target === 'function';
}
function Enumerable(value) {
    return function (_target, _propertyKey, descriptor) {
        descriptor.enumerable = value;
    };
}

var Config = {
    debug: false
};

var VelayError = /** @class */ (function (_super) {
    __extends(VelayError, _super);
    function VelayError(msg) {
        var _this = this;
        var mergedMsg = "[Velay:Core] " + (msg || '');
        _this = _super.call(this, mergedMsg) || this;
        return _this;
    }
    return VelayError;
}(Error));

// TODO env and log level
var Debugger = /** @class */ (function () {
    function Debugger() {
    }
    Object.defineProperty(Debugger, "_prefixedMsg", {
        get: function () {
            var datetime = new Date();
            return "[" + datetime.toJSON().slice(0, 10) + " " + datetime.toTimeString().slice(0, 8) + "][Velay:Core] ";
        },
        enumerable: true,
        configurable: true
    });
    Debugger._shouldOutput = function () {
        return !!Config.debug;
    };
    Debugger.output = function (type, args) {
        if (!Debugger._shouldOutput()) {
            return;
        }
        var fn = console[type];
        return fn && fn.apply(void 0, [Debugger._prefixedMsg].concat(args));
    };
    Debugger.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return Debugger.output('warn', args);
    };
    Debugger.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return Debugger.output('log', args);
    };
    Debugger.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return Debugger.output('error', args);
    };
    Debugger.throw = function (msg) {
        throw new VelayError(typeof msg === 'object' ? msg.message : msg);
    };
    return Debugger;
}());

var _uid = 1;
/**
 * Vuex store class
 */
var StoreService = /** @class */ (function () {
    function StoreService() {
        // tslint:disable-next-line:variable-name
        // public static __local_decorators__: { key: string; type: string; descriptor?: any }[] = [];
        this._storeBinded = false;
        var uid = _uid++;
        Object.defineProperty(this, '_storeNamespace', {
            enumerable: false,
            configurable: false,
            get: function () {
                return (this.constructor.name || 'StoreService') + "Namespace" + uid;
            }
        });
    }
    return StoreService;
}());
function handleStoreServiceBinding(service, vm) {
    if (!isStoreService(service)) {
        return;
    }
    if (service._storeBinded) {
        return;
    }
    service._storeBinded = true;
    var constructor = service.constructor;
    if (!constructor.__local_decorators__ || constructor.__local_decorators__.length === 0) {
        return;
    }
    var vuexStore = vm.$velayStore;
    if (!vuexStore) {
        vuexStore = vm.$velayStore = new Store({
            state: {}
        });
    }
    service._store = vuexStore;
    // collect state, getters, actions, mutations to a storeoptions object
    var state = {};
    var getters = {};
    var mutations = {};
    constructor.__local_decorators__.forEach(function (decoratorDesc) {
        var key = decoratorDesc.key, descriptor = decoratorDesc.descriptor;
        switch (decoratorDesc.type) {
            case 'State':
                if (state[key] === undefined) {
                    state[key] = service[key];
                    mutations["_" + key + "_mutation"] = function (state, payload) {
                        state[key] = payload;
                    };
                    Object.defineProperty(service, key, {
                        get: function () {
                            return vuexStore.state[service._storeNamespace][key];
                        },
                        set: function (value) {
                            return vuexStore.commit(service._storeNamespace + "/_" + key + "_mutation", value);
                        }
                    });
                }
                break;
            case 'Getter':
                if (descriptor) {
                    var method_1 = descriptor.get;
                    if (isFunction(method_1)) {
                        getters[key] = function () { return method_1.call(service); };
                        Object.defineProperty(service, key, {
                            get: function () {
                                return vuexStore.getters[service._storeNamespace + "/" + key];
                            }
                        });
                    }
                }
                break;
            case 'Action':
                // no need
                break;
            case 'Mutation':
                // no need
                break;
            default:
                return;
        }
    });
    // bind methods to instance
    var proto = Object.getPrototypeOf(service);
    if (proto.__proto__ !== StoreService.prototype) {
        Debugger.warn("It's not recommended for multiple inheritance of 'StoreService'");
    }
    var descriptors = Object.getOwnPropertyDescriptors(proto);
    Object.keys(descriptors).forEach(function (key) {
        var descriptor = descriptors[key];
        if (descriptor.value && isFunction(descriptor.value) && key !== 'constructor') {
            Object.defineProperty(service, key, __assign({}, descriptor, { value: descriptor.value.bind(service) }));
        }
    });
    // register vuex module for this dataservice
    vuexStore.registerModule(service._storeNamespace, {
        namespaced: true,
        state: state,
        getters: getters,
        actions: {},
        mutations: mutations
    });
}
function isStoreService(instance) {
    return instance && instance instanceof StoreService;
}

function collectDataFromConstructor(vm, Component) {
    // override _init to prevent to init as Vue instance
    var originalInit = Component.prototype._init;
    Component.prototype._init = function () {
        var _this = this;
        // proxy to actual vm
        var keys = Object.getOwnPropertyNames(vm);
        // 2.2.0 compat (props are no longer exposed as self properties)
        if (vm.$options.props) {
            for (var key in vm.$options.props) {
                if (!vm.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
        }
        keys.forEach(function (key) {
            if (key.charAt(0) !== '_') {
                Object.defineProperty(_this, key, {
                    get: function () { return vm[key]; },
                    set: function (value) {
                        vm[key] = value;
                    },
                    configurable: true
                });
            }
        });
    };
    // should be acquired class property values
    var data = new Component();
    // restore original _init to avoid memory leak (#209)
    Component.prototype._init = originalInit;
    // create plain data object
    var plainData = {};
    Object.keys(data).forEach(function (key) {
        if (data[key] !== undefined && !isStoreService(data[key])) {
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

var $internalHooks = [
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
function componentFactory(Component, options, id) {
    if (options === void 0) { options = {}; }
    options.name = options.name || Component._componentTag || Component.name;
    // prototype props.
    var proto = Component.prototype;
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === 'constructor') {
            return;
        }
        // hooks
        if ($internalHooks.indexOf(key) > -1) {
            options[key] = proto[key];
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (descriptor.value !== void 0) {
            // methods
            if (isFunction(descriptor.value)) {
                (options.methods || (options.methods = {}))[key] = descriptor.value;
            }
            else {
                // typescript decorated data
                (options.mixins || (options.mixins = [])).push({
                    data: function () {
                        var _a;
                        return _a = {}, _a[key] = descriptor.value, _a;
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
        data: function () {
            return collectDataFromConstructor(this, Component);
        }
    });
    // decorate options
    var decorators = Component.__decorators__;
    if (decorators) {
        decorators.forEach(function (fn) { return fn(options); });
        delete Component.__decorators__;
    }
    // find super
    var superProto = Object.getPrototypeOf(Component.prototype);
    var Super = superProto instanceof Vue ? superProto.constructor : Vue;
    var Extended = Super.extend(Object.assign({}, options, { _vid: id }));
    forwardStaticMembers(Extended, Component, Super);
    if (reflectionIsSupported) {
        copyReflectionMetadata(Extended, Component);
    }
    return Extended;
}
var reservedPropertyNames = [
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
    Object.getOwnPropertyNames(Original).forEach(function (key) {
        // `prototype` should not be overwritten
        if (key === 'prototype') {
            return;
        }
        // Some browsers does not allow reconfigure built-in properties
        var extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key);
        if (extendedDescriptor && !extendedDescriptor.configurable) {
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(Original, key);
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
            var superDescriptor = Object.getOwnPropertyDescriptor(Super, key);
            if (!isPrimitive(descriptor.value) && superDescriptor && superDescriptor.value === descriptor.value) {
                return;
            }
        }
        // Warn if the users manually declare reserved properties
        if (process.env.NODE_ENV !== 'production' && reservedPropertyNames.indexOf(key) >= 0) {
            warn("Static property name '" + key + "' declared on class '" + Original.name + "' " +
                'conflicts with reserved property name of Vue internal. ' +
                'It may cause unexpected behavior of the component. Consider renaming the property.');
        }
        Object.defineProperty(Extended, key, descriptor);
    });
}

var EMPTY = 'Velay:EMPTY';
var CIRCULAR = 'Velay:CIRCULAR';
var INJECTABLE_FLAG = 'Velay:Injectable';

var Injector = /** @class */ (function () {
    function Injector() {
        this._records = new Map();
    }
    Injector.create = function () {
        return new Injector();
    };
    Injector.checkInjectable = function (token) {
        var injectable = Reflect.getMetadata(INJECTABLE_FLAG, token) === true;
        if (!injectable) {
            throw new VelayError(token.name + " is not injectable, do you forgot add the 'Injectable' decorator?");
        }
        return true;
    };
    Injector.prototype.registerProvider = function () {
        var _this = this;
        var providers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            providers[_i] = arguments[_i];
        }
        providers.forEach(function (provider) {
            if (_this._records.has(provider.token)) {
                Debugger.warn("Provider of " + provider.token.name + " has been registered already.");
            }
            else {
                Debugger.log("Provider of " + provider.token.name + " is registered now.");
            }
            if (provider.value === undefined) {
                provider.value = EMPTY;
            }
            _this._records.set(provider.token, provider);
        });
        return this;
    };
    Injector.prototype.resolve = function (token) {
        Injector.checkInjectable(token);
        // TODO maybe constuctor with 0 params can be resolved.
        // const subParamTypes = Reflect.getMetadata('design:paramtypes', token) || [];
        // if (subParamTypes.length > 0) {
        //     return null;
        // }
        var record = this._records.get(token);
        if (!record) {
            throw new VelayError(token.name + " is not registered in injector");
        }
        try {
            var value = this._resolveToken(record);
            if (record.value === CIRCULAR) {
                record.value = EMPTY;
            }
            return value;
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
    };
    Injector.prototype._resolveToken = function (record) {
        var _a;
        var fn = record.token;
        var value = record.value;
        if (value === CIRCULAR) {
            throw new VelayError('Circular dependency');
        }
        else if (value === EMPTY) {
            record.value = CIRCULAR;
            var deps = [];
            var paramTypes = Reflect.getMetadata('design:paramtypes', record.token) || [];
            for (var i = 0; i < paramTypes.length; i++) {
                var paramType = paramTypes[i];
                deps.push(this.resolve(paramType));
            }
            value = new ((_a = fn).bind.apply(_a, [void 0].concat(deps)))();
            if (record.cacheable) {
                record.value = value;
            }
        }
        return value;
    };
    Injector.prototype.has = function (token) {
        return this._records.has(token);
    };
    Injector.prototype.list = function () {
        return Array.from(this._records.values());
    };
    Injector.prototype.toString = function () {
        var tokens = [];
        var records = this._records;
        records.forEach(function (v, token) { return tokens.push(token.name || token.toString()); });
        return "Injector[" + tokens.join(', ') + "]";
    };
    __decorate([
        Enumerable(false)
    ], Injector.prototype, "_resolveToken", null);
    return Injector;
}());

var StaticInjector = /** @class */ (function () {
    function StaticInjector() {
        throw new Error('StaticInjector is not constructable');
    }
    StaticInjector.registerProvider = function () {
        var providers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            providers[_i] = arguments[_i];
        }
        var _a;
        return (_a = StaticInjector._injector).registerProvider.apply(_a, providers);
    };
    StaticInjector.resolve = function (token) {
        return StaticInjector._injector.resolve(token);
    };
    StaticInjector.has = function (token) {
        return StaticInjector._injector.has(token);
    };
    StaticInjector.list = function () {
        return StaticInjector._injector.list();
    };
    StaticInjector.toString = function () {
        return "Static" + StaticInjector._injector.toString();
    };
    StaticInjector._injector = Injector.create();
    return StaticInjector;
}());

function getInjectedConstructor(target) {
    var paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
    var params = [];
    for (var i = 0; i < paramTypes.length; i++) {
        var paramType = paramTypes[i];
        if (!isFunction(paramType)) {
            Debugger.warn("pamameter " + (i + 1) + " of " + target.name + " is not a constructor");
            return null;
        }
        if (paramType === Object || paramType === Function) {
            Debugger.warn("pamameter " + (i + 1) + " of " + target.name + " is not a valid constructor");
            return null;
        }
        if (!StaticInjector.has(paramType)) {
            Debugger.warn(paramType.name + " cannot be resolved");
            var subParamTypes = Reflect.getMetadata('design:paramtypes', paramType) || [];
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
    var InjectedConstructor = function () {
        return new (target.bind.apply(target, [void 0].concat(params)))();
    };
    InjectedConstructor.prototype = target.prototype;
    Object.defineProperty(InjectedConstructor, 'name', {
        writable: false,
        configurable: false,
        value: target.name
    });
    return InjectedConstructor;
}

var componentId = 1;
function getComponentNameAndId(options, component) {
    if (typeof options === 'object' && options.name) {
        return options.name;
    }
    if (isFunction(options) && options.options && options.options.name) {
        return options.options.name;
    }
    var klass = (component || options);
    var constructorName = klass.name || (klass.constructor && Component.constructor.name);
    var id = componentId++;
    return { name: constructorName || "VueComponent" + componentId++, id: id };
}
function injectService(Component, id) {
    var instance = new Component();
    var vueInstance = new Vue();
    Vue.mixin({
        beforeCreate: function () {
            var _this = this;
            if (this.$options._vid !== id) {
                return;
            }
            var vuePropKeys = Object.getOwnPropertyNames(vueInstance);
            var paramKeys = Object.getOwnPropertyNames(instance).filter(function (k) { return !vuePropKeys.includes(k); });
            paramKeys.forEach(function (key) {
                // auto injected services must be functions or customized store service
                if (isFunction(instance[key]) || isStoreService(instance[key])) {
                    handleStoreServiceBinding(instance[key], _this);
                    _this[key] = instance[key];
                }
            });
        }
    });
}
function assembleComponent(Component, options) {
    var _a = getComponentNameAndId(options, Component), name = _a.name, id = _a.id;
    var target = getInjectedConstructor(Component);
    if (!target) {
        throw new Error(Component.name + " dependency injection failed");
    }
    target.__decorators__ = Component.__decorators__;
    injectService(target, id);
    return componentFactory(target, __assign({}, options, { name: name }), id);
}
function Component(options) {
    if (isFunction(options)) {
        return assembleComponent(options, { _Ctor: {} });
    }
    return function (Component) {
        return assembleComponent(Component, __assign({}, options, { _Ctor: {} }));
    };
}
function registerHooks(keys) {
    $internalHooks.push.apply($internalHooks, keys);
}
Component.registerHooks = registerHooks;

var DEFAULT_INJECTABLE_OPTIONS = {
    cacheable: true
};
function Injectable(options) {
    var mergedOptions;
    if (isFunction(options)) {
        Reflect.defineMetadata(INJECTABLE_FLAG, true, options);
        StaticInjector.registerProvider({
            token: options,
            cacheable: DEFAULT_INJECTABLE_OPTIONS.cacheable,
            value: EMPTY
        });
        return options;
    }
    mergedOptions = Object.assign({}, DEFAULT_INJECTABLE_OPTIONS, options || {});
    return function (target) {
        Reflect.defineMetadata(INJECTABLE_FLAG, true, target);
        StaticInjector.registerProvider({
            token: target,
            cacheable: mergedOptions.cacheable,
            value: EMPTY
        });
    };
}

function onlyForStoreService(decorator, target) {
    if (!(target instanceof StoreService)) {
        Debugger.throw("Decorator " + decorator + " can only be used at StoreService");
    }
}
function collectDecorator(decorator, target, key, descriptor) {
    if (!target.constructor) {
        return;
    }
    target.constructor.__local_decorators__ = target.constructor.__local_decorators__ || [];
    target.constructor.__local_decorators__.push({
        type: decorator,
        key: key,
        descriptor: descriptor
    });
}
// https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators
function State(target, key, descriptor) {
    // property decorator has no descriptor
    if (descriptor) {
        Debugger.throw("State decorator can only be used on a class property, target: " + target.constructor.name + ", key: " + key);
    }
    onlyForStoreService('State', target);
    collectDecorator('State', target, key);
}
function Getter(target, key, descriptor) {
    if (!descriptor || !isFunction(descriptor.get)) {
        Debugger.throw("Getter decorator can only be used on a get method of a class, target: " + target.constructor.name + ", key: " + key);
    }
    onlyForStoreService('Getter', target);
    collectDecorator('Getter', target, key, descriptor);
}
function Action(target, key, descriptor) {
    if (!descriptor || !isFunction(descriptor.value)) {
        Debugger.throw("Action decorator can only be used on a method of a class, target: " + target.constructor.name + ", key: " + key);
    }
    onlyForStoreService('Action', target);
    collectDecorator('Action', target, key, descriptor);
}
function Mutation(target, key, descriptor) {
    if (!descriptor || !isFunction(descriptor.value)) {
        Debugger.throw("Mutation decorator can only be used on a method of a class, target: " + target.constructor.name + ", key: " + key);
    }
    onlyForStoreService('Mutation', target);
    collectDecorator('Mutation', target, key, descriptor);
}

// type Readonly<T> = { readonly [P in keyof T]: T[P] };
var VueComponent = /** @class */ (function (_super) {
    __extends(VueComponent, _super);
    function VueComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // tslint:disable-next-line:variable-name
        _this._props_ = {};
        return _this;
    }
    return VueComponent;
}(Vue));

Vue.use(Vuex);
var Velay = {
    Inject: Inject,
    Model: Model,
    Prop: Prop,
    Emit: Emit,
    Provide: Provide,
    Watch: Watch,
    Component: Component,
    registerHooks: registerHooks,
    State: State,
    Getter: Getter,
    Action: Action,
    Mutation: Mutation,
    Injectable: Injectable,
    VueComponent: VueComponent,
    Vue: Vue,
    StaticInjector: StaticInjector,
    Injector: Injector,
    version: '',
    config: {},
    providers: [],
    StoreService: StoreService
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
    get: function () {
        return StaticInjector.list();
    }
});

export default Velay;
export { Component, registerHooks, State, Getter, Action, Mutation, Injectable, VueComponent, StaticInjector, Injector, StoreService };
//# sourceMappingURL=index.js.map
