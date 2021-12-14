import { Application } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { router } from "./routes.ts";
import logger from "https://deno.land/x/oak_logger@1.0.0/mod.ts";

const PORT = 8002;
const CERTIFICATE_PATH = "/etc/letsencrypt/live/dog.jamalam.tech/fullchain.pem";
const PRIVATE_KEY_PATH = "/etc/letsencrypt/live/dog.jamalam.tech/privkey.pem";

const app = new Application();

let development = false;

await Deno.readTextFile(CERTIFICATE_PATH).catch(() => {
  console.log(
    "Certificate file not found; using development environment settings",
  );
  development = true;
});

app.use(logger.logger);
app.use(logger.responseTime);

app.addEventListener("listen", () => {
  console.log(`Listening on port ${PORT}`);
});

console.log("Development:", development);

if (!development) {
  console.log("Using production environment settings");

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
  console.log("Using development environment settings");

  app.use(
    oakCors({
      origin: false,
    }),
  );

  app.use(router.allowedMethods());
  app.use(router.routes());

  await app.listen({
    port: PORT,
  });
}
