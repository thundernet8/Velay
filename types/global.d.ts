import Velay from './index';

declare global {
    interface Window {
        Velay: typeof Velay;
    }

    namespace NodeJS {
        interface Global {}

        interface Process {}
    }
}

// export {};
