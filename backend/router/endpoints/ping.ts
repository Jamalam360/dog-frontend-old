import { SUCCESS, SUCCESS_CODE } from "../../constants.ts";
import { router } from "../routes.ts";

router.get("/v0/ping", (ctx) => {
  ctx.response.status = SUCCESS_CODE;
  ctx.response.body = {
    status: SUCCESS,
    message: "Hello, World!",
  };
});

router.get("/v0/ping/:name", (ctx) => {
  ctx.response.status = SUCCESS_CODE;
  ctx.response.body = {
    status: SUCCESS,
    message: `Hello, ${ctx.params.name}!`,
  };
});
