declare class CommonStorage {
    static exists(storage: Storage): boolean;
    static default(): {
        key: null;
        value: null;
    };
}
declare class LocalStorage extends CommonStorage {
    static exists(): boolean;
    static get(key: string): "" | {
        key: string;
        value: string | null;
    };
    static set(key: string, value: string): {
        key: null;
        value: null;
    } | {
        key: string;
        value: string;
    };
    static all(): {};
}
declare class SessionStorage extends CommonStorage {
    static exists(): boolean;
    static get(key: string): "" | {
        key: string;
        value: string | null;
    };
    static set(key: string, value: string): {
        key: null;
        value: null;
    } | {
        key: string;
        value: string;
    };
    static all(): any;
}
export { LocalStorage, SessionStorage };
//# sourceMappingURL=Storage.d.ts.map