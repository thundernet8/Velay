export default class VelayError extends Error {
    constructor(msg?: string) {
        const mergedMsg = `[Velay:Core] ${msg || ''}`;
        super(mergedMsg);
    }
}
