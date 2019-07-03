
class LocalStorage {
  public static checkAvailability() {
    const testKey = '__test__';

    try {
      localStorage.setItem(testKey, '__test-value__');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('Local storage is not available! Some features will be disabled!');
      return false;
    }
  }

  private _isLocalStorageAvailable: boolean | null = null;

  constructor() {
    this._isLocalStorageAvailable = LocalStorage.checkAvailability();
  }

  public set<T>(key: string, item: T): void {
    if (!this._isLocalStorageAvailable) { return; }

    localStorage.setItem(key, JSON.stringify(item));
  }

  public get<T, D>(key: string, def: D): T | D {
    let result: T | D = def;
    if (!this._isLocalStorageAvailable) { return result; }

    const data = localStorage.getItem(key);

    try {
      result = data ? JSON.parse(data) as T : def;
    } catch (e) {
      console.error(
        `Error while parsing data from localstorage for key: ${key}.
        Error is: ${e.message}, stack is: ${e.stack}`,
      );
    }

    return result;
  }

  public remove(key: string) {
    if (!this._isLocalStorageAvailable) { return; }

    localStorage.removeItem(key);
  }
}

const storage = new LocalStorage();

export { LocalStorage };
export default storage;
