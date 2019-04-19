import StoreService from './vuex';
import Debugger from '../utils/debugger';
import { isFunction } from '../utils/index';

function onlyForStoreService(decorator: string, target: any) {
    if (!(target instanceof StoreService)) {
        Debugger.throw(`Decorator ${decorator} can only be used at StoreService`);
    }
}

function collectDecorator(decorator: string, target: any, key: string, descriptor?: any) {
    if (!target.constructor) {
        return;
    }
    target.constructor.__local_decorators__ = target.constructor.__local_decorators__ || [];
    target.constructor.__local_decorators__.push({
        type: decorator,
        key,
        descriptor
    });
}

// https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators
export function State(target: StoreService, key: string, descriptor?: any) {
    // property decorator has no descriptor
    if (descriptor) {
        Debugger.throw(
            `State decorator can only be used on a class property, target: ${target.constructor.name}, key: ${key}`
        );
    }
    onlyForStoreService('State', target);
    collectDecorator('State', target, key);
}

export function Getter(target: StoreService, key: string, descriptor?: any) {
    if (!descriptor || !isFunction(descriptor.get)) {
        Debugger.throw(
            `Getter decorator can only be used on a get method of a class, target: ${
                target.constructor.name
            }, key: ${key}`
        );
    }
    onlyForStoreService('Getter', target);
    collectDecorator('Getter', target, key, descriptor);
}

export function Action(target: StoreService, key: string, descriptor?: any) {
    if (!descriptor || !isFunction(descriptor.value)) {
        Debugger.throw(
            `Action decorator can only be used on a method of a class, target: ${target.constructor.name}, key: ${key}`
        );
    }
    onlyForStoreService('Action', target);
    collectDecorator('Action', target, key, descriptor);
}

export function Mutation(target: StoreService, key: string, descriptor?: any) {
    if (!descriptor || !isFunction(descriptor.value)) {
        Debugger.throw(
            `Mutation decorator can only be used on a method of a class, target: ${
                target.constructor.name
            }, key: ${key}`
        );
    }
    onlyForStoreService('Mutation', target);
    collectDecorator('Mutation', target, key, descriptor);
}
