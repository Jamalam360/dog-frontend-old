/** @jsx h */
import { h, useEffect, useState } from "../client_deps.ts";

export default function InProgress() {
  const [value, setValue] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    if (value <= 100) {
      setValue(value + 1);
    } else {
      setValue(0);
    }
    setTimeout(() => {
      setForceUpdate(!forceUpdate);
    }, 1);
  }, [forceUpdate]);

  return (
    <div class="display-flex flex-direction-column align-items-center justify-content-center">
      <h1>
        Sorry, we're still working on this page; please visit us again later to
        view it.
      </h1>
      <progress max="100" value={value} />
    </div>
  );
}
