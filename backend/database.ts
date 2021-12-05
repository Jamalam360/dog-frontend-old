import { Bson, MongoClient } from "https://deno.land/x/mongo@v0.28.1/mod.ts";
import { getRandomDogImage } from "./dogApi.ts";

const client = new MongoClient();

await client.connect("mongodb://127.0.0.1:27017");

interface Post {
  _id: Bson.ObjectId;
  votes: number;
  imageUrl: string;
  index: number;
}

const db = client.database("dog_image_website_db");
const posts = db.collection<Post>("posts");

export const getPostWithIndex = async (
  index: number,
): Promise<Post | undefined> => {
  return await posts.findOne({ index: index });
};

export const createPost = async (index: number): Promise<Post | undefined> => {
  const id = await posts.insertOne({
    votes: 0,
    imageUrl: await getRandomDogImage(),
    index: index,
  });

  return await posts.findOne({ _id: id });
};

export const addVote = async (index: number): Promise<Post | undefined> => {
  const post = await getPostWithIndex(index);

  if (post) {
    await posts.updateOne(
      { _id: post._id },
      { $inc: { votes: 1 } },
    );
  }

  return await getPostWithIndex(index);
};

export const removeVote = async (index: number): Promise<Post | undefined> => {
  const post = await getPostWithIndex(index);

  if (post) {
    await posts.updateOne(
      { _id: post._id },
      { $inc: { votes: -1 } },
    );
  }

  return await getPostWithIndex(index);
};
