class Config {
    private _debug: boolean = false;

    get debug() {
        return this._debug;
    }

    set debug(value) {
        this._debug = !!value;
        if (value) {
            console.log('%c Debug mode enabled, use window.Velay to get more information.', 'color:#409EFF;');
        }
    }
}

export default new Config();
