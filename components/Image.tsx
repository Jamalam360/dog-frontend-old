/** @jsx h */
import { h } from "../client_deps.ts";

interface ImageProps extends h.JSX.HTMLAttributes<HTMLImageElement> {
  source: string;
}

export default function Image(
  props: ImageProps,
) {
  return (
    <img
      class={props.class}
      src={props.source}
      key={props.source}
    />
  );
}
