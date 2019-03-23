export type NoneFunctionKeys<T> = { [P in keyof T]: T[P] extends Function ? never : P }[keyof T];
export type FunctionKeys<T> = { [P in keyof T]: T[P] extends Function ? P : never }[keyof T];
export type OmitFunction<T> = Pick<T, Exclude<keyof T, NoneFunctionKeys<T>>>;
export type EmitFunction<T> = Pick<T, Exclude<keyof T, FunctionKeys<T>>>;
export type Include<T, K extends String> = Exclude<keyof T, Exclude<keyof T, K>>;
export type Prop<T, K extends keyof T> = T[K];
export type OmitState<T> = Pick<
    T,
    Exclude<
        keyof T,
        'state' | 'actions' | 'mutations' | 'modules' | 'getters' | 'context' | 'namespaced' | FunctionKeys<T>
    >
>;
