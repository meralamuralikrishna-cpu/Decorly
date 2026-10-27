import { useCallback, useRef, useState } from 'react';

export function useUndoRedo<T>(initial: T, max = 40) {
  const [present, setPresent] = useState<T>(initial);
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);
  const [version, setVersion] = useState(0);

  const bump = () => setVersion((v) => v + 1);

  const set = useCallback(
    (next: T | ((prev: T) => T), recordHistory = true) => {
      setPresent((prev) => {
        const value = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        if (recordHistory) {
          past.current = [...past.current.slice(-(max - 1)), prev];
          future.current = [];
          queueMicrotask(bump);
        }
        return value;
      });
    },
    [max],
  );

  const commitSnapshot = useCallback(() => {
    setPresent((prev) => {
      past.current = [...past.current.slice(-(max - 1)), prev];
      future.current = [];
      queueMicrotask(bump);
      return prev;
    });
  }, [max]);

  const undo = useCallback(() => {
    setPresent((prev) => {
      if (past.current.length === 0) return prev;
      const previous = past.current[past.current.length - 1];
      past.current = past.current.slice(0, -1);
      future.current = [prev, ...future.current];
      queueMicrotask(bump);
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    setPresent((prev) => {
      if (future.current.length === 0) return prev;
      const next = future.current[0];
      future.current = future.current.slice(1);
      past.current = [...past.current, prev];
      queueMicrotask(bump);
      return next;
    });
  }, []);

  const reset = useCallback((value: T) => {
    past.current = [];
    future.current = [];
    setPresent(value);
    bump();
  }, []);

  // version forces re-read of refs
  void version;
  const canUndo = past.current.length > 0;
  const canRedo = future.current.length > 0;

  return { present, set, undo, redo, reset, canUndo, canRedo, commitSnapshot };
}
