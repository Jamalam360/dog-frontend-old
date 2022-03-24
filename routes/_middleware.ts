import { createReporter } from "https://deno.land/x/g_a@0.1.2/mod.ts";
import { MiddlewareHandlerContext } from "../server_deps.ts";

const ga = createReporter();
export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
  const start = performance.now();
  const res = await ctx.handle();
  ga(req, ctx, res, start);
  return res;
}
