class CommonStorage {
  static exists(storage: Storage) {
    return storage !== undefined && storage !== null;
  }

  static default() {
    return {key: null, value: null};
  }
}

class LocalStorage extends CommonStorage {
  static exists() {
    return super.exists(localStorage);
  }

  static get(key: string) {
    return LocalStorage.exists() ? {key, value: localStorage.getItem(key)} : '';
  }

  static set(key: string, value: string) {
    if (LocalStorage.exists()) {
      localStorage.setItem(key, value);
      return {key, value};
    }
    return LocalStorage.default();
  }

  static all() {
    if (LocalStorage.exists()) {
      return Object.keys(localStorage).reduce((a, c) => ({...a, [c]: localStorage.getItem(c)}), {});
    }
    return LocalStorage.default();
  }
}

class SessionStorage extends CommonStorage {
  static exists() {
    return super.exists(sessionStorage);
  }

  static get(key: string) {
    return SessionStorage.exists() ? {key, value: sessionStorage.getItem(key)} : '';
  }

  static set(key: string, value: string) {
    if (SessionStorage.exists()) {
      sessionStorage.setItem(key, value);
      return {key, value};
    }
    return SessionStorage.default();
  }

  static all() {
    if (sessionStorage.exists()) {
      return Object.keys(sessionStorage).reduce((a, c) => ({...a, [c]: sessionStorage.getItem(c)}), {});
    }
    return sessionStorage.default();
  }
}

export {LocalStorage, SessionStorage};
