import { Bson, MongoClient } from "https://deno.land/x/mongo@v0.28.1/mod.ts";
import { getRandomDogImage } from "./dogApi.ts";
import Snowflake from "https://deno.land/x/snowflake@v1/mod.ts"

const client = new MongoClient();
const snowflake: Snowflake = new Snowflake();

await client.connect("mongodb://127.0.0.1:27017");

interface Post {
  _id: Bson.ObjectId;
  votes: number;
  imageUrl: string;
  index: number;
}

interface User {
  _id: Bson.ObjectId;
  snowflake: string;
  votedOn: number[];
}

const db = client.database("dog_image_website_db");
const posts = db.collection<Post>("posts");
const users = db.collection<User>("users");

const appendTillIndex = (
  index: number,
  value: number,
  arr: number[],
): number[] => {
  if (arr.length < index) {
    let currentIndex = 0;

    while (currentIndex < index) {
      if (arr[currentIndex] == null) {
        arr.push(0);
      }
      currentIndex++;
    }

    arr.push(value);
  } else {
    arr[index] = value;
  }

  return arr;
};

export const createUser = async(): Promise<User | undefined> => {
  const user = await users.insertOne({
    snowflake: snowflake.toBase64(await snowflake.generate()),
    votedOn: [],
  });

  return await users.findOne({ _id: user });
}

export const getOrCreatePost = async (
  index: number,
): Promise<Post | undefined> => {
  let post = await posts.findOne({ index: index });

  if (!post) {
    const id = await posts.insertOne({
      votes: 0,
      imageUrl: await getRandomDogImage(),
      index: index,
    });

    post = await posts.findOne({ _id: id });
  }

  return post;
};

export const getOrCreateUser = async (
  userSnowflake: string
): Promise<User | undefined> => {
  if (await users.findOne({ snowflake: userSnowflake })) {
    return await users.findOne({ snowflake: userSnowflake });
  } else {
    return await createUser();
  }
};

export const addVoteToUser = async (
  user: User,
  postIndex: number,
  voteValue: number,
) => {
  await users.updateOne(
    { _id: user._id },
    {
      $set: {
        votedOn: appendTillIndex(postIndex, voteValue, user.votedOn),
      },
    },
  );
};

export const removeVoteFromUser = async (
  user: User,
  postIndex: number,
) => {
  user.votedOn[postIndex] = 0;
  await users.updateOne(
    { _id: user._id },
    {
      $set: {
        votedOn: user.votedOn,
      },
    },
  );
};

export const addVote = async (index: number): Promise<Post | undefined> => {
  const post = await getOrCreatePost(index);

  if (post) {
    await posts.updateOne({ _id: post._id }, { $inc: { votes: 1 } });
  }

  return await getOrCreatePost(index);
};

export const removeVote = async (index: number): Promise<Post | undefined> => {
  const post = await getOrCreatePost(index);

  if (post) {
    await posts.updateOne({ _id: post._id }, { $inc: { votes: -1 } });
  }

  return await getOrCreatePost(index);
};
