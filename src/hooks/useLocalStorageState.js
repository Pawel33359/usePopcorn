import { useEffect, useState } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(() => {
    // Get array from local storage(if not array then return initial state passed as argument)
    const stored = JSON.parse(localStorage.getItem(key));
    return stored ? stored : initialState;
  });
  // set new array to local state each time it changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
