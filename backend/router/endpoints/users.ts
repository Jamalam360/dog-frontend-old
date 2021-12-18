import {
  ERROR,
  INTERNAL_SERVER_ERROR_CODE,
  SUCCESS,
  SUCCESS_CODE,
} from "../../constants.ts";
import { router } from "../routes.ts";
import { createUser } from "../../database/database.ts";

router.get("/v0/user/new", async (ctx) => {
  const user = await createUser();
  if (user) {
    ctx.response.status = SUCCESS_CODE;
    ctx.response.body = {
      status: SUCCESS,
      snowflake: user.snowflake,
    };
  } else {
    ctx.response.status = INTERNAL_SERVER_ERROR_CODE;
    ctx.response.body = {
      status: ERROR,
      message: "Failed to get or create user",
    };
  }
});
