/** @jsx h */
import { h, useEffect, useState } from "../client_deps.ts";
import { Settings } from "./Settings.tsx";
import {
  useHorizontalSwipeListener,
  useLocalStorageBackedState,
} from "../util/hooks.ts";

import Image from "../components/Image.tsx";

interface Image {
  url?: string;
  votes?: number;
  voteValue?: number;
}

export default function RedirectToHome({ indexProp }: { indexProp?: number }) {
  const [image, setImage] = useState({} as Image);
  const [vote, setVote] = useState(0);

  const [settings, _setSettings] = useLocalStorageBackedState<Settings>(
    "settings",
    {
      defaultValue: { advanceOnVote: false, hideTotal: false },
    },
  );

  const [index, setIndex] = useLocalStorageBackedState<number>(
    "index",
    {
      defaultValue: 0,
      preferredValue: indexProp,
      type: "number",
    },
  );

  const [snowflake, setSnowflake] = useLocalStorageBackedState<string>(
    "snowflake",
    {
      defaultValue: "unset",
      type: "string",
    },
  );

  useEffect(() => { // Set the snowflake  and settings from localStorage, or generate new ones if unset
    if (snowflake == "unset") {
      fetch("https://dog.jamalam.tech:8002/v0/user/new").then((res) =>
        res.json().then((json) => {
          setSnowflake(json.snowflake);
        })
      );
    }
  }, []);

  useEffect(() => { // Update the image when the vote value changes
    if (snowflake == "" || index == -1) return;

    if (image.voteValue != vote) {
      fetch(
        `https://dog.jamalam.tech:8002/v0/posts/${index}/vote/${vote}/${snowflake}`,
      ).then((res) => {
        res.json().then((json) => {
          setImage({
            url: json.url,
            votes: json.votes,
            voteValue: json.value,
          });

          if (settings!.advanceOnVote) {
            setTimeout(
              () => setIndex(index! + 1),
              settings!.hideTotal ? 650 : 350,
            );
          }
        });
      });
    }
  }, [vote]);

  useEffect(() => { // Update the image state when the index or snowflake update
    if (snowflake == "" || index == -1) return;

    fetch(`https://dog.jamalam.tech:8002/v0/posts/${index}/${snowflake}`).then(
      (res) => {
        res.json().then((json) => {
          setImage({
            url: json.url,
            votes: json.votes,
            voteValue: json.value,
          });
        });
      },
    );
  }, [index, snowflake]);

  useEffect(() => {
    setVote(image.voteValue!);
  }, [image]);

  if (index == -1 || snowflake == "" || !image.url) return <div />; // Wait until our useEffect's have run

  // Change the style of the button based on whether we have voted yet or not
  const leftStyle = image.voteValue == -1 ? "color-yellow-shadow" : "";
  const rightStyle = image.voteValue == 1 ? "color-yellow-shadow" : "";

  let votes = "?";

  if (!settings!.hideTotal || image.voteValue != 0) {
    votes = image.votes!.toString();
  }

  const [touchStart, touchMove, touchEnd] = useHorizontalSwipeListener(
    () => setIndex(index! + 1),
    () => setIndex(index! - 1),
  );

  return (
    <div
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      class="max-width-800px display-flex justify-content-center align-items-center flex-direction-column"
    >
      <div class="display-flex flex-direction-row pad-bottom-20px align-items-center pad-vertical-20px">
        <i
          class="fa-solid fa-arrow-left font-size-300p pad-horizontal-20px button-hover-animation"
          onClick={(_) => {
            if (index! > 0) {
              setIndex(index! - 1);
            }
          }}
        />
        <i
          class="fa-solid fa-share font-size-225p pad-horizontal-20px button-hover-animation"
          onClick={async (_) => {
            if (typeof navigator.share !== "undefined") {
              await navigator.share({
                url: `https://dog.jamalam.tech/share?i=${index}`,
              });
            } else if (typeof navigator.clipboard.writeText !== "undefined") {
              await navigator.clipboard.writeText(
                `https://dog.jamalam.tech/share?i=${index}`,
              );
              alert("Link copied to clipboard");
            }
          }}
        />
        <i
          class="fa-solid fa-gear font-size-225p pad-horizontal-20px button-hover-animation"
          onClick={(_) => {
            window.location.href = "https://dog.jamalam.tech/settings";
          }}
        />
        <i
          class="fa-solid fa-arrow-right font-size-300p pad-horizontal-20px button-hover-animation"
          onClick={(_) => {
            setIndex(index! + 1);
          }}
        />
      </div>
      <Image
        source={image.url}
        class="min-height-60vh max-height-60vh object-fit-cover"
      />
      <div class="display-flex flex-direction-row pad-vertical-20px">
        <i
          class={`fa-solid fa-arrow-down font-size-300p pad-horizontal-30px button-hover-animation ${leftStyle}`}
          onClick={(_) => {
            if (image.voteValue == 0 || image.voteValue == 1) {
              setVote(-1);
            } else if (image.voteValue == -1) {
              setVote(0);
            }
          }}
        />
        <i
          class={`fa-solid fa-arrow-up font-size-300p pad-horizontal-30px button-hover-animation ${rightStyle}`}
          onClick={(_) => {
            if (image.voteValue == 0 || image.voteValue == -1) {
              setVote(1);
            } else if (image.voteValue == 1) {
              setVote(0);
            }
          }}
        />
      </div>
      <h1>{votes}</h1>
    </div>
  );
}
