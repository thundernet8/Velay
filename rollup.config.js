import typescript from 'rollup-plugin-typescript2';

export default [
    {
        input: 'src/index.ts',
        output: ['cjs', 'esm'].map(format => ({
            file: `lib/${format}/index.js`,
            format,
            name: 'velay',
            sourcemap: true,
            exports: 'named'
        })),
        external: ['vue', 'reflect-metadata', 'vue-property-decorator'],
        plugins: [typescript({ useTsconfigDeclarationDir: true })]
    }
];
