"use client";

// Tiny typed event bus for cross-component flourishes (collect FX, etc.)
type Handler<T> = (payload: T) => void;

interface Events {
  collect: { id: string; scrap: string };
  openBook: void;
}

const map = new Map<keyof Events, Set<Handler<any>>>();

export const bus = {
  on<K extends keyof Events>(key: K, fn: Handler<Events[K]>) {
    if (!map.has(key)) map.set(key, new Set());
    map.get(key)!.add(fn);
    return () => map.get(key)!.delete(fn);
  },
  emit<K extends keyof Events>(key: K, payload: Events[K]) {
    map.get(key)?.forEach((fn) => fn(payload));
  },
};
