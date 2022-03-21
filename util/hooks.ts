import { StateUpdater, useEffect, useState } from "../client_deps.ts";

export function useLocalStorageBackedState<T>(
  key: string,
  options: { defaultValue?: T; preferredValue?: T },
): [T | undefined, StateUpdater<T | undefined>] {
  if (typeof localStorage !== "undefined") {
    let value;

    if (options.preferredValue) {
      value = options.preferredValue;
    } else if (localStorage[key]) {
      value = JSON.parse(localStorage[key]) as T;
    } else if (options.defaultValue) {
      value = options.defaultValue;
    } else {
      value = undefined;
    }

    const [state, setState] = useState(value);

    useEffect(() => {
      localStorage[key] = JSON.stringify(state);
    }, [state]);

    return [state, setState];
  } else {
    return useState(undefined as T | undefined);
  }
}
