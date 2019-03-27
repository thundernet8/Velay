export function isFunction(target: any) {
    return typeof target === 'function';
}

export function Enumerable(value: boolean) {
    return function(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}
