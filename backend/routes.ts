import { Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import {
  addVote,
  getOrCreatePost,
  getOrCreateUser,
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
  const index = parseInt(ctx.params.index as string);
  const post = await getOrCreatePost(index);
  const user = await getOrCreateUser(ctx.request.ip);
  let value = 0;

  if (user?.votedOn[index] == 1) {
    value = 1;
  } else if (user?.votedOn[index] == -1) {
    value = -1;
  }

  if (post) {
    ctx.response.body = {
      status: "success",
      url: post.imageUrl,
      index: post.index,
      votes: post.votes,
      value: value,
    };
  } else {
    ctx.response.body = {
      status: "error",
      message: "Failed to get or create post",
    };
  }
});

router.get("/posts/:index/removeVote", async (ctx) => {
  const user = await getOrCreateUser(ctx.request.ip);
  const index = parseInt(ctx.params.index as string);

  if (user?.votedOn[index] == 1) {
    const post = await removeVote(index);

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
  } else if (user?.votedOn[index] == -1) {
    const post = await addVote(index);

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
  } else {
    ctx.response.body = {
      status: "erorr",
      message: "Failed to remove vote",
    };
  }
});

router.get("/posts/:index/up", async (ctx) => {
  const user = await getOrCreateUser(ctx.request.ip);
  const index = parseInt(ctx.params.index as string);

  if (user?.votedOn[index] == 0 || user?.votedOn[index] == -1) {
    if (user?.votedOn[index] == -1) {
      await addVote(index);
    }

    const post = await addVote(index);

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
  } else {
    ctx.response.body = {
      status: "erorr",
      message: "User has already voted on this post",
    };
  }
});

router.get("/posts/:index/down", async (ctx) => {
  const user = await getOrCreateUser(ctx.request.ip);
  const index = parseInt(ctx.params.index as string);

  if (user?.votedOn[index] == 0 || user?.votedOn[index] == 1) {
    if (user?.votedOn[index] == 1) {
      await removeVote(index);
    }

    const post = await removeVote(index);

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
  } else {
    ctx.response.body = {
      status: "erorr",
      message: "User has already voted on this post",
    };
  }
});
