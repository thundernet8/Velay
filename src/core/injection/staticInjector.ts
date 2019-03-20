import Injector from './injector';
import { ProviderRecord } from '../../types/index';

export default class StaticInjector {
    private static readonly _injector: Injector = Injector.create();

    static registerProvider(...providers: ProviderRecord[]) {
        //
    }
}
