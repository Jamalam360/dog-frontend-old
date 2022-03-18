/** @jsx h */
import { h, PageProps } from "../client_deps.ts";
import { HandlerContext } from "../server_deps.ts";
import Head from "../components/Head.tsx";
import InProgress from "../islands/InProgress.tsx";
import Footer from "../components/Footer.tsx";

interface IndexProps {
  index: number | undefined;
  image: string;
}

export const handler = async (
  req: Request,
  ctx: HandlerContext,
): Promise<Response> => {
  const params = new URLSearchParams(req.url.split("?")[1]);

  if (params.has("i")) {
    return ctx.render(
      {
        image: (await (await fetch(
          `https://dog.jamalam.tech:8002/v0/posts/${params.get("i")}`,
        )).json()).url,
        index: parseInt(params.get("i")!),
      },
    );
  }

  return ctx.render({
    image: (await (await fetch(
      `https://dog.jamalam.tech:8002/v0/posts/0`,
    )).json()).url,
    index: undefined,
  });
};

export default function Home({ data }: PageProps<IndexProps>) {
  return (
    <div class="display-flex justify-content-center align-items-center flex-direction-column">
      <Head
        title="dog.jamalam.tech"
        description="Vote on dogs at https://dog.jamalam.tech/"
        image={data.image}
      />
      <InProgress />
      <Footer />
    </div>
  );
}
