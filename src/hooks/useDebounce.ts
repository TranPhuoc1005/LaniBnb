import { useEffect, useState } from "react";

export const useDebounce = (value: string, delay: number) => {
    const [debounce, setDebounce] = useState<string>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounce(value)
        }, delay);
        return () => clearTimeout(handler);
    }, [value]);

    return debounce;
}