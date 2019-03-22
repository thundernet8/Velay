/// <reference types="jasmine" />

import Velay from 'lib/cjs/index.js';

describe('VelayStatic', () => {
    it('should have version prop of velay', () => {
        const version = Velay.version;

        expect(version).toMatch(/^[0-9]+\.[0-9]+\.[0-9]+$/);
    });
});
