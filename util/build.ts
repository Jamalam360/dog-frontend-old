import { parse } from "https://deno.land/x/dot_env@0.2.0/mod.ts";

const baseDir = "./style";

async function packUp(dir: string, base: string): Promise<string> {
  for await (const file of Deno.readDir(`${baseDir}/${dir}`)) {
    console.log(`Found path: ${baseDir}/${dir}/${file.name}`);
    if (file.isDirectory) {
      base += await packUp(file.name, base);
    } else if (file.name.endsWith(".css")) {
      base += await Deno.readTextFile(`${baseDir}/${dir}/${file.name}`);
    }
  }

  return base;
}

export async function populateEnv() {
  const env = parse(await Deno.readTextFile(".env"));
  for (const key in env) {
    if (Object.prototype.hasOwnProperty.call(env, key)) {
      const element = env[key];
      Deno.env.set(key, element);
    }
  }
}

await Deno.writeTextFile(
  "./static/packed.css",
  await packUp("", '@charset "UTF-8";'),
);

try {
  await populateEnv();
} catch (e) {
  if (e instanceof Deno.errors.NotFound) {
    console.log("No .env file found, skipping");
  } else {
    throw e;
  }
}
