/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { start } from "./server_deps.ts";
import manifest from "./fresh.gen.ts";

if (Deno.env.get("DENO_DEPLOYMENT_ID") == undefined) {
  await import("./util/build.ts");
}

await start(manifest);
