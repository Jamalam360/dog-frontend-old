import { StateUpdater, useEffect, useState } from "../client_deps.ts";

export function useLocalStorageBackedState<T>(
  key: string,
  options?: {
    defaultValue?: T;
    preferredValue?: T;
    type?: "number" | "json" | "string";
  },
): [T | undefined, StateUpdater<T | undefined>] {
  if (typeof localStorage !== "undefined") {
    let value;

    if (!options?.type) {
      options!.type = "json";
    }

    if (options?.preferredValue) {
      value = options.preferredValue;
    } else if (localStorage[key]) {
      if (options?.type == "json") {
        value = JSON.parse(localStorage[key]) as T;
      } else if (options?.type == "number") {
        value = parseInt(localStorage[key]);
      } else if (options?.type == "string") {
        value = localStorage[key];
      }
    } else if (options?.defaultValue) {
      value = options.defaultValue;
    } else {
      value = undefined;
    }

    const [state, setState] = useState(value);

    useEffect(() => {
      if (options?.type == "json") {
        localStorage[key] = JSON.stringify(state);
      } else {
        localStorage[key] = state;
      }
    }, [state]);

    return [state, setState];
  } else {
    return useState(undefined as T | undefined);
  }
}

export function useHorizontalSwipeListener(
  onLeft: () => void,
  onRight: () => void,
): [
  (e: TouchEvent) => void,
  (e: TouchEvent) => void,
  () => void,
] {
  const [touchStart, setTouchStart] = useState(undefined as undefined | number);
  const [touchEnd, setTouchEnd] = useState(undefined as undefined | number);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(undefined);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      onLeft();
    }

    if (isRightSwipe) {
      onRight();
    }
  };

  return [onTouchStart, onTouchMove, onTouchEnd];
}
