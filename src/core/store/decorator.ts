import StoreService from './vuex';
import Debugger from '../utils/debugger';

function onlyForStoreService(decorator: string, target: any) {
    if (!(target instanceof StoreService)) {
        Debugger.throw(`Decorator ${decorator} can only be used at StoreService`);
    }
}

function collectDecorator(decorator: string, target: any, key: string, descriptor?: any) {
    // const Ctor = typeof target === 'function' ? (target as StoreService) : (target.constructor as StoreService);
    // if (!StoreService.__local_decorators__) {
    //     Ctor.__local_decorators__ = [];
    // }
    // if (typeof index !== 'number') {
    //     index = undefined;
    // }
    console.log('collectDecorator', {
        type: decorator,
        key,
        descriptor
    });
    StoreService.__local_decorators__.push({
        type: decorator,
        key,
        descriptor
    });
}

// https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators
export function State(target: StoreService, key: string) {
    onlyForStoreService('State', target);
    collectDecorator('State', target, key);
}

export function Getter(target: StoreService, key: string, descriptor?: any) {
    onlyForStoreService('Getter', target);
    collectDecorator('Getter', target, key, descriptor);
}

export function Action(target: StoreService, key: string, descriptor?: any) {
    onlyForStoreService('Action', target);
    collectDecorator('Action', target, key, descriptor);
}

export function Mutation(target: StoreService, key: string, descriptor?: any) {
    onlyForStoreService('Mutation', target);
    collectDecorator('Mutation', target, key, descriptor);
}
