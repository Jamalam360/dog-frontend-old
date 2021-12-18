import { cyan, yellow } from "https://deno.land/std@0.53.0/fmt/colors.ts";

const BASE_URL =
  "https://api.github.com/repos/Jamalam360/dog-api-images/contents";
const CACHE_FILE = "image_cache.json";
const TOKEN = await Deno.readTextFile("./gh.env");

let images: string[] = [];

async function isRateLimited(): Promise<boolean> {
  const res = await fetch(BASE_URL, {
    headers: {
      "Authorization": "token " + TOKEN,
    },
  });

  return res.headers.get("X-RateLimit-Remaining") == "0";
}

async function fetchAllImagesFromDir(
  dirName: string,
  arr: string[],
): Promise<string[]> {
  const res = await fetch(BASE_URL + "/" + dirName, {
    headers: {
      "Authorization": "token " + TOKEN,
    },
  });
  const contents = await res.json();

  for (const content of contents) {
    if (content.type == "dir") {
      arr = await fetchAllImagesFromDir(content.path, arr);
    } else if (content.type == "file") {
      if (content.name.includes(".jpg")) {
        arr.push(content.download_url);
      }
    }
  }

  return arr;
}

async function cacheImages(arr: string[]) {
  const object = {
    cacheTime: Date.now(),
    images: arr,
  };

  await Deno.writeTextFile(CACHE_FILE, JSON.stringify(object), {
    append: false,
    create: true,
  });
}

async function getCachedImages(): Promise<string[]> {
  const json = JSON.parse(await Deno.readTextFile(CACHE_FILE));
  return json.images;
}

async function shouldRecache(): Promise<boolean> {
  let exists = true;
  const json = await Deno.readTextFile(CACHE_FILE).catch(() => {
    exists = false;
  });

  if (!exists) {
    return true;
  }

  const date = new Date(JSON.parse(json as string).cacheTime);

  console.log(yellow("Current Date: " + new Date().toString()));
  console.log(yellow("Last Cache Date: " + date.toString()));
  console.log(
    Math.round((new Date().getTime() - date.getTime()) / (1000 * 60 * 60)),
  );
  return Math.round(
    (new Date().getTime() - date.getTime()) / (1000 * 60 * 60),
  ) >= 2; // 2 hour delay between recaches
}

export const getRandomImage = (): string => {
  return images[Math.floor(Math.random() * images.length)];
};

export const tryRecache = async () => {
  let recache;
  const needsRecache = await shouldRecache();
  const hitRateLimit = await isRateLimited();

  if (needsRecache) {
    if (hitRateLimit) {
      console.log(
        yellow(
          "A recache is scheduled, but the API is rate-limited at this time",
        ),
      );
      recache = false;
    } else {
      recache = true;
    }
  } else {
    recache = false;
  }

  if (recache) {
    console.log(cyan("Recaching images..."));
    images = await fetchAllImagesFromDir("", []);
    await cacheImages(images);
  } else if (images.length == 0) {
    console.log(cyan("Reading cached images..."));
    images = await getCachedImages();
  }
};

await tryRecache();
console.log(cyan("Discovered and Cached " + images.length + " images"));
