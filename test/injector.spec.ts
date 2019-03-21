/// <reference types="jasmine" />

import Velay from 'lib/cjs/index.js';
import { expect } from './ext/matcher';

const { Injectable, Injector } = Velay;

@Injectable
class Engine {}

@Injectable
class Car {
    constructor(public engine: Engine) {
        this.engine = engine;
    }
}

describe('Injector', () => {
    it('should instantiate a class without dependencies', () => {
        const injector = Injector.create();
        injector.registerProvider({
            token: Engine,
            cacheable: false
        });
        const engine = injector.resolve(Engine);

        expect(engine).toBeAnInstanceOf(Engine);
    });

    it('should toString called with right output', () => {
        const injector = Injector.create();
        injector.registerProvider({
            token: Engine,
            cacheable: false
        });
        const text = injector.toString();

        expect(text).toEqual('Injector[Engine]');
    });
});
