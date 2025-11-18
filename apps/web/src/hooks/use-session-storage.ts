import { useEffect, useState } from "react";

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error("Error reading sessionStorage:", err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("Error writing sessionStorage:", err);
    }
  }, [key, value]);

  // Optional: sync antar tab (walaupun sessionStorage biasanya tab-scoped)
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key]);

  return [value, setValue] as const;
}
