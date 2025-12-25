import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('toolsprint-favorites', []);

  const toggleFavorite = (slug: string) => {
    setFavorites(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

  return { favorites, toggleFavorite, isFavorite };
}

export function useRecentlyUsed() {
  const [recentlyUsed, setRecentlyUsed] = useLocalStorage<string[]>('toolsprint-recent', []);

  const addToRecent = (slug: string) => {
    setRecentlyUsed(prev => {
      const filtered = prev.filter(s => s !== slug);
      return [slug, ...filtered].slice(0, 10);
    });
  };

  return { recentlyUsed, addToRecent };
}
