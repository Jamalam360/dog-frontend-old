import { StateUpdater, useEffect, useState } from "../client_deps.ts";
import { Settings } from "../islands/Settings.tsx";
import { getUserIndex, setUserIndex } from "./backend.ts";

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

export function useSnowflake(): [string, StateUpdater<string>] {
  const [s, set] = useLocalStorageBackedState<string>(
    "snowflake",
    {
      defaultValue: "unset",
      type: "string",
    },
  ) as [string, StateUpdater<string>];

  useEffect(() => { // Generate a new one if unset
    if (s == "unset") {
      fetch("https://dog.jamalam.tech:8002/v0/user/new").then((res) =>
        res.json().then((json) => {
          set(json.snowflake);
        })
      );
    }
  }, []);

  return [s, set];
}

export function useSettings(): [Settings, StateUpdater<Settings>] {
  const [s, set] = useLocalStorageBackedState<Settings>(
    "settings",
    {
      defaultValue: { advanceOnVote: false, hideTotal: false },
    },
  ) as [Settings, StateUpdater<Settings>];

  return [s, set];
}

export function useIndex(
  property: number | undefined,
  snowflake: string,
): [number, StateUpdater<number>] {
  let state = 0;

  if (property) {
    state = property;
  }

  const [s, set] = useState(state);

  useEffect(() => {
    getUserIndex(snowflake).then((number) => {
      if (state != 0) {
        set(number);
      }
    });
  }, [snowflake]);

  useEffect(() => {
    if (s == 0) return;
    setUserIndex(s, snowflake);
  }, [s]);

  return [s, set];
}
