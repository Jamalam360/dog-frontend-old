import { Application } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { router } from "./routes.ts";

const PORT = 8002;

const app = new Application();

if (true) {
  app.use(
    oakCors({
      origin: "https://dog.jamalam.tech",
    }),
  );
} else {
  app.use(
    oakCors({
      origin: "*",
    }),
  );
}

app.use(router.allowedMethods());
app.use(router.routes());

app.addEventListener("listen", () => {
  console.log(`Listening on port ${PORT}`);
});

await app.listen({
  port: PORT,
  secure: true,
  certFile: "/etc/letsencrypt/live/dog.jamalam.tech/fullchain.pem",
  keyFile: "/etc/letsencrypt/live/dog.jamalam.tech/privkey.pem",
});
