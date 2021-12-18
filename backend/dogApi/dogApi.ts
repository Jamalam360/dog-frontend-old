import { cyan, yellow } from "https://deno.land/std@0.53.0/fmt/colors.ts";

const BASE_URL = "https://api.github.com/repos/Jamalam360/dog-api-images/contents";
const CACHE_FILE = "image_cache.json";
const CACHE_DELAY = new Date().getTime() + (1 * 24 * 60 * 60 * 1000) // Recache every 24 hours
const TOKEN = await Deno.readTextFile("./gh.env");

async function isRateLimited(): Promise<boolean> {
    const res = await fetch(BASE_URL, {
        headers: {
            "Authorization": "token " + TOKEN,
        }
    });

    return res.headers.get("X-RateLimit-Remaining") == "0";
}

async function fetchAllImagesFromDir(dirName: string, arr: string[]): Promise<string[]> {
    const res = await fetch(BASE_URL + "/" + dirName, {
        headers: {
            "Authorization": "token " + TOKEN,
        }
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
    console.log(yellow("Last Cache Date: " + date.toString()))
    return date.getTime() < CACHE_DELAY;
}

let images: string[];
let recache;

if (await shouldRecache()) {
    if (await isRateLimited()) {
        console.log(yellow("A recache is scheduled, but the API is rate-limited at this time"));
        recache = false;
    } else {
        recache = true;
    }
} else {
    recache = false;
}

if (recache) {
    console.log(cyan("Recaching images..."))
    images = await fetchAllImagesFromDir("", []);
    await cacheImages(images)
} else {
    console.log(cyan("Reading cached images..."))
    images = await getCachedImages();
}

console.log(cyan("Discovered and Cached " + images.length + " images"));

export const getRandomImage = (): string => {
    return images[Math.floor((Math.random() * images.length))]
};