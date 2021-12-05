import { Application } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { router } from "./routes.ts";

const PORT = 3601;

const app = new Application();

app.use(
  oakCors({
    origin: "*",
  })
)

app.use(router.allowedMethods());
app.use(router.routes());

app.addEventListener("listen", () => {
  console.log(`Listening on: localhost:${PORT}`);
});

await app.listen({ port: PORT });
