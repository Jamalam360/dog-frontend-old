/** @jsx h */
import { h, useEffect, useState } from "../client_deps.ts";
import {
  useHorizontalSwipeListener,
  useIndex,
  useLocalStorageBackedState,
  useSettings,
  useSnowflake,
} from "../util/hooks.ts";
import { share } from "../util/share.ts";

import Image from "../components/Image.tsx";

interface Image {
  url?: string;
  votes?: number;
  voteValue?: number;
}

export default function RedirectToHome({ indexProp }: { indexProp?: number }) {
  const [image, setImage] = useState({} as Image);
  const [vote, setVote] = useState(0);
  const [settings, _1] = useSettings();
  const [snowflake, _2] = useSnowflake();

  // const [index, setIndex] = useLocalStorageBackedState<number>(
  //   "index",
  //   {
  //     defaultValue: 0,
  //     preferredValue: indexProp,
  //     type: "number",
  //   },
  // );

  const [index, setIndex] = useIndex(indexProp, snowflake);

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

  if (index == -1 || snowflake == "" || !image.url) return <div />; // Wait until the useEffect's have run

  const [onTouchStart, onTouchMove, onTouchEnd] = useHorizontalSwipeListener(
    () => setIndex(index! + 1),
    () => setIndex(index! - 1),
  );

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
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
            await share(`https://dog.jamalam.tech/share?i=${index}`);
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
        class="min-height-60vh max-height-60vh object-fit-cover border-radius-10px"
        onDblClick={(_) => {
          window.open(image.url, "_blank")?.focus();
        }}
      />
      <div class="display-flex flex-direction-row pad-vertical-20px">
        <i
          class={`fa-solid fa-arrow-down font-size-300p pad-horizontal-30px button-hover-animation ${
            image.voteValue == -1 ? "color-yellow-shadow" : ""
          }`}
          onClick={(_) => {
            if (image.voteValue == 0 || image.voteValue == 1) {
              setVote(-1);
            } else if (image.voteValue == -1) {
              setVote(0);
            }
          }}
        />
        <i
          class={`fa-solid fa-arrow-up font-size-300p pad-horizontal-30px button-hover-animation ${
            image.voteValue == 1 ? "color-yellow-shadow" : ""
          }`}
          onClick={(_) => {
            if (image.voteValue == 0 || image.voteValue == -1) {
              setVote(1);
            } else if (image.voteValue == 1) {
              setVote(0);
            }
          }}
        />
      </div>
      <h1>
        {(!settings?.hideTotal || image.voteValue != 0) ? image.votes : "?"}
      </h1>
    </div>
  );
}
