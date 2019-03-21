/// <reference types="jasmine" />

import Velay from 'lib/cjs/index.js';
import { expect } from './ext/matcher';

const { Injectable, StaticInjector } = Velay;

@Injectable
class Engine {}

@Injectable
class Car {
    constructor(public engine: Engine) {
        this.engine = engine;
    }
}

describe('StaticInjector', () => {
    it('should instantiate a class without dependencies', () => {
        StaticInjector.registerProvider({
            token: Engine,
            cacheable: false
        });
        const engine = StaticInjector.resolve(Engine);

        expect(engine).toBeAnInstanceOf(Engine);
    });
});
