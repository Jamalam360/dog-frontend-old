import { Router } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import {
  addVote,
  addVoteToUser,
  createUser,
  getOrCreatePost,
  getOrCreateUser,
  removeVote,
  removeVoteFromUser,
} from "./database.ts";
import {
  ERROR,
  FORBIDDEN_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
  SUCCESS,
  SUCCESS_CODE,
} from "./constants.ts";

export const router = new Router();

router.get("/ping", (ctx) => {
  ctx.response.status = SUCCESS_CODE;
  ctx.response.body = {
    status: SUCCESS,
    message: "Hello, World!",
  };
});

router.get("/ping/:name", (ctx) => {
  ctx.response.status = SUCCESS_CODE;
  ctx.response.body = {
    status: SUCCESS,
    message: `Hello, ${ctx.params.name}!`,
  };
});

router.get("/user/new", async (ctx) => {
  const user = await createUser();

  if (user) {
    ctx.response.status = SUCCESS_CODE;
    ctx.response.body = {
      status: SUCCESS,
      snowflake: user.snowflake,
    };
  } else {
    ctx.response.status = NOT_FOUND_CODE;
    ctx.response.body = {
      status: ERROR,
      message: "Failed to get or create user",
    };
  }
});

router.get("/posts/:index/:id", async (ctx) => {
  const index = parseInt(ctx.params.index as string);
  const post = await getOrCreatePost(index);

  if (post) {
    const user = await getOrCreateUser(ctx.params.id as string);

    if (!(user?.votedOn[index])) {
      addVoteToUser(user!, index, 0);
    }

    let value = 0;
    if (user?.votedOn[index]) {
      value = user.votedOn[index];
    }

    ctx.response.status = SUCCESS_CODE;
    ctx.response.body = {
      status: SUCCESS,
      url: post.imageUrl,
      index: post.index,
      votes: post.votes,
      value: value,
    };
  } else {
    ctx.response.status = NOT_FOUND_CODE;
    ctx.response.body = {
      status: ERROR,
      message: "Failed to get or create post",
    };
  }
});

router.get("/posts/:index/removeVote/:id", async (ctx) => {
  const user = await getOrCreateUser(ctx.params.id as string);
  const index = parseInt(ctx.params.index as string);

  if (user?.votedOn[index] == 1) {
    await removeVoteFromUser(user, index);
    const post = await removeVote(index);

    if (post) {
      ctx.response.status = SUCCESS_CODE;
      ctx.response.body = {
        status: SUCCESS,
        url: post.imageUrl,
        index: post.index,
        votes: post.votes,
        value: (await getOrCreateUser(ctx.params.id as string))?.votedOn[index],
      };
    } else {
      ctx.response.status = NOT_FOUND_CODE;
      ctx.response.body = {
        status: ERROR,
        message: "Failed to get or create post",
      };
    }
  } else if (user?.votedOn[index] == -1) {
    await removeVoteFromUser(user, index);
    const post = await addVote(index);

    if (post) {
      ctx.response.status = SUCCESS_CODE;
      ctx.response.body = {
        status: SUCCESS,
        url: post.imageUrl,
        index: post.index,
        votes: post.votes,
        value: (await getOrCreateUser(ctx.params.id as string))?.votedOn[index],
      };
    } else {
      ctx.response.status = NOT_FOUND_CODE;
      ctx.response.body = {
        status: ERROR,
        message: "Failed to get or create post",
      };
    }
  } else {
    ctx.response.status = INTERNAL_SERVER_ERROR_CODE;
    ctx.response.body = {
      status: ERROR,
      message: "Failed to remove vote",
    };
  }
});

router.get("/posts/:index/up/:id", async (ctx) => {
  const user = await getOrCreateUser(ctx.params.id as string);
  const index = parseInt(ctx.params.index as string);

  if (user?.votedOn[index] == 0) {
    await addVoteToUser(user!, index, 1);
    const post = await addVote(index);

    if (post) {
      ctx.response.status = SUCCESS_CODE;
      ctx.response.body = {
        status: SUCCESS,
        url: post.imageUrl,
        index: post.index,
        votes: post.votes,
        value: (await getOrCreateUser(ctx.params.id as string))?.votedOn[index],
      };
    } else {
      ctx.response.status = NOT_FOUND_CODE;
      ctx.response.body = {
        status: ERROR,
        message: "Failed to get or create post",
      };
    }
  } else {
    ctx.response.status = FORBIDDEN_ERROR_CODE;
    ctx.response.body = {
      status: ERROR,
      message: "User has already voted on this post",
    };
  }
});

router.get("/posts/:index/down/:id", async (ctx) => {
  const user = await getOrCreateUser(ctx.params.id as string);
  const index = parseInt(ctx.params.index as string);

  if (user?.votedOn[index] == 0) {
    await addVoteToUser(user!, index, -1);
    const post = await removeVote(index);

    if (post) {
      ctx.response.body = {
        status: SUCCESS,
        url: post.imageUrl,
        index: post.index,
        votes: post.votes,
        value: (await getOrCreateUser(ctx.params.id as string))?.votedOn[index],
      };
    } else {
      ctx.response.status = NOT_FOUND_CODE;
      ctx.response.body = {
        status: ERROR,
        message: "Failed to get or create post",
      };
    }
  } else {
    ctx.response.status = FORBIDDEN_ERROR_CODE;
    ctx.response.body = {
      status: ERROR,
      message: "User has already voted on this post",
    };
  }
});
