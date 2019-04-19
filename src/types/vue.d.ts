/**
 * Extends interfaces in Vue.js
 */

import Vue, { ComponentOptions } from 'vue';
import { Store } from 'vuex';

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        velayStore?: Store<any>;
    }
}

declare module 'vue/types/vue' {
    interface Vue {
        $velayStore: Store<any>;
    }
}
