import { Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import {
  addVote,
  createPost,
  getPostWithIndex,
  removeVote,
} from "./database.ts";

export const router = new Router();

router.get("/ping", (ctx) => {
  ctx.response.body = {
    status: "success",
    message: "Hello, World!",
  };
});

router.get("/ping/:name", (ctx) => {
  ctx.response.body = {
    status: "success",
    message: `Hello, ${ctx.params.name}!`,
  };
});

router.get("/posts/:index", async (ctx) => {
  let post = await getPostWithIndex(parseInt(ctx.params.index as string));

  if (!post) {
    post = await createPost(parseInt(ctx.params.index as string));
  }

  if (post) {
    ctx.response.body = {
      status: "success",
      url: post.imageUrl,
      index: post.index,
      votes: post.votes,
    };
  } else {
    ctx.response.body = {
      status: "error",
      message: "Failed to get or create post",
    };
  }
});

router.get("/posts/:index/up", async (ctx) => {
  const post = await addVote(parseInt(ctx.params.index as string));

  if (post) {
    ctx.response.body = {
      status: "success",
      url: post.imageUrl,
      index: post.index,
      votes: post.votes,
    };
  } else {
    ctx.response.body = {
      status: "error",
      message: "Failed to get or create post",
    };
  }
});

router.get("/posts/:index/down", async (ctx) => {
  const post = await removeVote(parseInt(ctx.params.index as string));

  if (post) {
    ctx.response.body = {
      status: "success",
      url: post.imageUrl,
      index: post.index,
      votes: post.votes,
    };
  } else {
    ctx.response.body = {
      status: "error",
      message: "Failed to get or create post",
    };
  }
});
