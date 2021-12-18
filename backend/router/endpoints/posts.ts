import {
  ERROR,
  NOT_FOUND_CODE,
  SUCCESS,
  SUCCESS_CODE,
  UNAUTHORISED_CODE,
} from "../../constants.ts";
import { router } from "../routes.ts";
import {
  getOrCreatePost,
  getUser,
  setVoteForPost,
  setVoteForUser,
} from "../../database/database.ts";

router.get("/v0/posts/:index/:id", async (ctx) => {
  const index = parseInt(ctx.params.index as string);
  const post = await getOrCreatePost(index);

  if (post) {
    const user = await getUser(ctx.params.id as string);

    if (!user) {
      ctx.response.status = UNAUTHORISED_CODE;
      ctx.response.body = {
        status: ERROR,
        message: "Unknown User Snowflake",
      };
    } else {
      if (!user?.votedOn[index]) {
        setVoteForUser(user!, index, 0);
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
    }
  } else {
    ctx.response.status = NOT_FOUND_CODE;
    ctx.response.body = {
      status: ERROR,
      message: "Failed to get or create post",
    };
  }
});

router.get("/v0/posts/:index/vote/:value/:id", async (ctx) => {
  const user = await getUser(ctx.params.id as string);
  const index = parseInt(ctx.params.index as string);
  const vote = parseInt(ctx.params.value as string);

  if (!user) {
    ctx.response.status = UNAUTHORISED_CODE;
    ctx.response.body = {
      status: ERROR,
      message: "Unknown User Snowflake",
    };
  } else {
    const original = user.votedOn[index];
    let post;

    if (original == 0) {
      post = await setVoteForPost(index, vote); // Vote will be -1 or 1
    } else if (original == 1) {
      if (vote == 0) {
        post = await setVoteForPost(index, -1);
      } else if (vote == 1) {
        post = await getOrCreatePost(index);
      } else if (vote == -1) {
        post = await setVoteForPost(index, -2);
      }
    } else if (original == -1) {
      if (vote == 0) {
        post = await setVoteForPost(index, 1);
      } else if (vote == -1) {
        post = await getOrCreatePost(index);
      } else if (vote == 1) {
        post = await setVoteForPost(index, 2);
      }
    }

    await setVoteForUser(user, index, vote);

    if (post) {
      ctx.response.status = SUCCESS_CODE;
      ctx.response.body = {
        status: SUCCESS,
        url: post.imageUrl,
        index: post.index,
        votes: post.votes,
        value: (await getUser(ctx.params.id as string))?.votedOn[index],
      };
    } else {
      ctx.response.status = NOT_FOUND_CODE;
      ctx.response.body = {
        status: ERROR,
        message: "Failed to get or create post",
      };
    }
  }
});
