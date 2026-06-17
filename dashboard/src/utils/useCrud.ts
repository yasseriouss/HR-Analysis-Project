import { useState, useCallback } from 'react';

export function useCrud<T extends { id?: string }>(initial: T[] = []) {
  const [items, setItems] = useState<T[]>(initial);

  const create = useCallback((item: T) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const update = useCallback((id: string, patch: Partial<T>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { items, create, update, remove, setItems };
}