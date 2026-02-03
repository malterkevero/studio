"use client"

import { useState, useEffect } from 'react';

const dateReviver = (key: string, value: any) => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  if (typeof value === 'string' && isoDateRegex.test(value)) {
    return new Date(value);
  }
  return value;
};

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [isMounted, setIsMounted] = useState(false);
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            try {
                const item = window.localStorage.getItem(key);
                setStoredValue(item ? JSON.parse(item, dateReviver) : initialValue);
            } catch (error) {
                console.error(error);
                setStoredValue(initialValue);
            }
        }
    }, [isMounted, key]);

    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        if (typeof window === 'undefined') {
            console.warn(`Tried to set localStorage key “${key}” even though no window was found`);
        }
        
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
