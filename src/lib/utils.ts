export const getLocalStorage = (key: string) => {
    return sessionStorage.getItem(key);
  };
  export const removeLocalStorage = (key: string) => {
    return sessionStorage.removeItem(key);
  };
  
  export const setLocalStorage = (key: string, payload: any) => {
    sessionStorage.setItem(
      key,
      typeof payload === "object" ? JSON.stringify(payload) : payload
    );
  };
  
  export const setLocalStorageObject = (obj: any) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const payload = obj[key];
        sessionStorage.setItem(
          key,
          typeof payload === "object" ? JSON.stringify(payload) : payload
        );
      }
    }
  };