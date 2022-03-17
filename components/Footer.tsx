/** @jsx h */
import { h } from "../client_deps.ts";

export default function Footer() {
  return (
    <div class="color-grey text-align-center line-height-24px">
      <p class="font-size-100p letter-spacing-9px">* * * * *</p>
      <p class="font-size-100p">
        This site was built with{" "}
        <a href="https://github.com/lucacasonato/fresh" target="_blank">
          Fresh
        </a>
      </p>
    </div>
  );
}
