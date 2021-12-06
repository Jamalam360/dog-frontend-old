import { Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import {
  addVote,
  addVoteToUser,
  getOrCreatePost,
  getOrCreateUser,
  removeVote,
  removeVoteFromUser,
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

  if (post) {
    const user = await getOrCreateUser(ctx.request.ip);

    if (!(user?.votedOn[index])) {
      addVoteToUser(user!, index, 0);
    }

    let value = 0;
    if (user?.votedOn[index]) {
      value = user.votedOn[index];
    }

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
    await removeVoteFromUser(user, index);
    const post = await removeVote(index);

    if (post) {
      ctx.response.body = {
        status: "success",
        url: post.imageUrl,
        index: post.index,
        votes: post.votes,
        value: (await getOrCreateUser(ctx.request.ip))?.votedOn[index],
      };
    } else {
      ctx.response.body = {
        status: "error",
        message: "Failed to get or create post",
      };
    }
  } else if (user?.votedOn[index] == -1) {
    await removeVoteFromUser(user, index);
    const post = await addVote(index);

    if (post) {
      ctx.response.body = {
        status: "success",
        url: post.imageUrl,
        index: post.index,
        votes: post.votes,
        value: (await getOrCreateUser(ctx.request.ip))?.votedOn[index],
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

  if (user?.votedOn[index] == 0) {
    await addVoteToUser(user!, index, 1);
    const post = await addVote(index);

    if (post) {
      ctx.response.body = {
        status: "success",
        url: post.imageUrl,
        index: post.index,
        votes: post.votes,
        value: (await getOrCreateUser(ctx.request.ip))?.votedOn[index],
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

  if (user?.votedOn[index] == 0) {
    await addVoteToUser(user!, index, -1);
    const post = await removeVote(index);

    if (post) {
      ctx.response.body = {
        status: "success",
        url: post.imageUrl,
        index: post.index,
        votes: post.votes,
        value: (await getOrCreateUser(ctx.request.ip))?.votedOn[index],
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
