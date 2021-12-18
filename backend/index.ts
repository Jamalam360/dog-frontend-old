import { Application } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { router } from "./router/routes.ts";
import "./router/initRoutes.ts";
import { cyan, yellow } from "https://deno.land/std@0.53.0/fmt/colors.ts";
import { tryRecache } from "./dogApi/dogApi.ts";

const PORT = 8002;
const CERTIFICATE_PATH = "/etc/letsencrypt/live/dog.jamalam.tech/fullchain.pem";
const PRIVATE_KEY_PATH = "/etc/letsencrypt/live/dog.jamalam.tech/privkey.pem";

const app = new Application();

let development = false;

await Deno.readTextFile(CERTIFICATE_PATH).catch(() => {
  console.log(
    yellow(
      "Certificate file not found; this should only occur in a development environment",
    ),
  );
  development = true;
});

router.forEach((entry) => {
  console.log(cyan("Registered Path: " + entry.path));
});

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(
    cyan(ctx.request.method + " " + ctx.request.url + " - " + rt + "ms"),
  );
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", ms + "ms");
});

app.use(async (ctx, next) => {
  await next();
  tryRecache();
});

app.addEventListener("listen", () => {
  console.log(cyan("Listening on port " + PORT));
});

if (!development) {
  console.log(cyan("Using production environment settings"));

  app.use(
    oakCors({
      origin: "https://dog.jamalam.tech",
    }),
  );

  app.use(router.allowedMethods());
  app.use(router.routes());

  await app.listen({
    port: PORT,
    secure: true,
    certFile: CERTIFICATE_PATH,
    keyFile: PRIVATE_KEY_PATH,
  });
} else {
  console.log(yellow("Using development environment settings"));

  app.use(router.allowedMethods());
  app.use(router.routes());

  await app.listen({
    port: PORT,
  });
}
