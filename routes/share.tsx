/** @jsx h */
import { h, PageProps } from "../client_deps.ts";
import { HandlerContext } from "../server_deps.ts";
import Head from "../components/Head.tsx";
import RedirectToHome from "../islands/RedirectToHome.tsx";

// This page lets us share a dog image, and is rendered fully server-side, so
// it can be used by Discord, Twitter etc. to generate a thumbnail/embed.
// Any client that connects to this page that _does_ execute client-side JS
// (i.e. not Discord or Twitter, somebody navigating via their browser) will
// be redirected to the home page, with the specified index.

interface ShareProps {
  image?: string;
  index?: number;
}

export const handler = async (
  req: Request,
  ctx: HandlerContext,
): Promise<Response> => {
  const params = new URLSearchParams(req.url.split("?")[1]);

  let index = 0;

  if (params.has("i")) {
    index = parseInt(params.get("i")!);
  }

  return ctx.render(
    {
      image: (await (await fetch(
        `https://dog.jamalam.tech/v0/posts/${params.get("i")}`,
      )).json()).url,
      index: index,
    },
  );
};

export default function Home({ data }: PageProps<ShareProps>) {
  if (!data.image && !data.index) {
    <div class="margin-60px-auto max-width-800px display-flex justify-content-center align-items-center flex-direction-column">
      <Head
        title="Doogle"
        description="Post not found"
        image=""
      />
    </div>;
  }

  return (
    <div class="margin-60px-auto max-width-800px display-flex justify-content-center align-items-center flex-direction-column">
      <Head
        title="Doogle"
        description="Post at https://dog.jamalam.tech/"
        image={data.image!}
      />
      <RedirectToHome index={data.index!} />
    </div>
  );
}
