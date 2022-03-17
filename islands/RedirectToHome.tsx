/** @jsx h */
import { h, useEffect } from "../client_deps.ts";

interface CounterProps {
  index: number;
}

export default function RedirectToHome({ index }: CounterProps) {
  useEffect(() => {
    window.location.href = `${window.location.origin}?i=${index}`;
  }, [index]);
  return (
    <div>
    </div>
  );
}
