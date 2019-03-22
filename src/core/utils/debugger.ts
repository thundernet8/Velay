// TODO env and log level
import Config from '../config';

export default class Debugger {
    private static get _prefixedMsg() {
        const datetime = new Date();
        return `[${datetime.toJSON().slice(0, 10)} ${datetime.toTimeString().slice(0, 8)}][Velay:Core] `;
    }

    private static _shouldOutput() {
        return !!Config.debug;
    }

    static output(type: string, args: any[]) {
        if (!Debugger._shouldOutput()) {
            return;
        }
        const fn = (console as any)[type];
        return fn && fn(Debugger._prefixedMsg, ...args);
    }

    static warn(...args: any[]) {
        return Debugger.output('warn', args);
    }

    static log(...args: any[]) {
        return Debugger.output('log', args);
    }

    static error(...args: any[]) {
        return Debugger.output('error', args);
    }
}
