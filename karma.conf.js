// ChromeHeadless
process.env.CHROME_BIN = require('puppeteer').executablePath();

// https://karma-runner.github.io/3.0/config/configuration-file.html
module.exports = function(config) {
    config.set({
        frameworks: ['jasmine', 'karma-typescript'],
        files: [
            {
                pattern: 'test/**/*.spec.ts'
            },
            {
                pattern: 'test/**/*.ts'
            }
        ],
        exclude: ['src/**/*.d.ts'],
        plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-typescript', 'karma-spec-reporter'],
        karmaTypescriptConfig: {
            tsconfig: './tsconfig.json',
            compilerOptions: {
                allowJs: true,
                module: 'commonjs',
                sourceMap: true,
                target: 'ES5',
                lib: ['DOM', 'ES2015']
            },
            include: ['src/**/*.ts', 'test/**.ts']
        },
        client: {
            clearContext: false
        },
        preprocessors: {
            'test/*.spec.ts': ['karma-typescript'],
            'test/**/*.ts': ['karma-typescript']
        },
        browsers: ['Chrome'],
        // you can define custom flags
        customLaunchers: {
            Chrome_without_security: {
                base: 'Chrome',
                flags: ['--disable-web-security']
            }
        },
        reporters: ['dots', 'spec', 'karma-typescript'],
        singleRun: false,
        urlRoot: '/',
        autoWatch: true,
        colors: true,
        logLevel: config.LOG_INFO,
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        }
    });
};
