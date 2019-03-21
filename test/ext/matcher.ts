declare interface MoreMatchers<T = any> extends jasmine.Matchers<T> {
    toBeAnInstanceOf(expected: any): boolean;

    toContainError(expected: any): boolean;
}

declare namespace jasmine {
    interface Matchers<T> {
        toBeAnInstanceOf(expected: any): boolean;

        toContainError(expected: any): boolean;
    }
}

const _global = (typeof window === 'undefined' ? global : window) as any;

export const expect: <T = any>(actual: T) => MoreMatchers<T> = _global.expect;

_global.beforeEach(function() {
    jasmine.addMatchers({
        toBeAnInstanceOf: function() {
            return {
                compare: function(actual: any, expectedClass: any) {
                    const pass = typeof actual === 'object' && actual instanceof expectedClass;
                    return {
                        pass: pass,
                        get message() {
                            return 'Expected ' + actual + ' to be an instance of ' + expectedClass;
                        }
                    };
                }
            };
        },

        toContainError: function() {
            return {
                compare: function(actual: any, expectedText: any) {
                    const errorMessage = actual.toString();
                    return {
                        pass: errorMessage.indexOf(expectedText) > -1,
                        get message() {
                            return 'Expected ' + errorMessage + ' to contain ' + expectedText;
                        }
                    };
                }
            };
        }
    });
});
