/** @jsx h */
import { h, Head as JSXHead } from "../client_deps.ts";

export default function Head(
  { title, description, image }: {
    title: string;
    description: string;
    image: string;
  },
) {
  return (
    <JSXHead>
      <title>Doogle</title>
      <script src="https://kit.fontawesome.com/df2dc764b4.js" />
      <link rel="stylesheet" href="/packed.css" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <meta property="og:site_name" content="Doogle" />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={description}
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content={image}
      />
    </JSXHead>
  );
}
