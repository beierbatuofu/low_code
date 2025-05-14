export const cleanLocalStorage = () => localStorage.clear();

export const setLocalStorage = (key: string, value: any) => {
	const v = typeof value == "string" ? value : JSON.stringify(value);
	localStorage.setItem(key, v);
};

export const getLocalStorage = (key: string) => localStorage.getItem(key);

export const removeLocalStorage = (key: string) => localStorage.removeItem(key);
