
export  default class LocalStorageUtility {

  public static setLocalStorage(key: String, value: String) {
    localStorage.setItem(String(key), String(value));
  }
  public static removeLocalStorage(key: String) {
    localStorage.removeItem(String(key));
  }

  public static getLocalStorage(key: String) {
    try {
      return localStorage.getItem(String(key));
    } catch (e) {
      return false;
    }
  }
}