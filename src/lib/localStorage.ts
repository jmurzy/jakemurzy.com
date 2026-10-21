export const getItem = <Value>(key: string): Value | null => {
	if (typeof window === "undefined") {
		return null;
	}

	const item = window?.localStorage?.getItem(key);

	if (!item) {
		return null;
	}

	try {
		return JSON.parse(item) as Value;
	} catch {
		return null;
	}
};

export const setItem = <Value>(key: string, value: Value) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(key, JSON.stringify(value));
};

export const clear = () => {
	if (typeof window === "undefined") return;
	window.localStorage.clear();
};
