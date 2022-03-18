/** @jsx h */
import { h, useEffect } from "../client_deps.ts";

interface KeyboardListenerProps {
  targetKey: string;
  callback: () => void;
}

export default function KeyboardListener(
  { targetKey, callback }: KeyboardListenerProps,
) {
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === targetKey) {
        callback();
      }
    }, false);

    return () => {
      document.removeEventListener("keydown", (e) => {
        if (e.key === targetKey) {
          callback();
        }
      }, false);
    };
  }, []);

  return <div />;
}
