/** @jsx h */
import { h, useEffect, useState } from "../client_deps.ts";

interface HomeProps {
  indexProp?: number;
}

interface Image {
  url?: string;
  votes?: number;
  voteValue?: number;
}

export default function RedirectToHome({ indexProp }: HomeProps) {
  const [snowflake, setSnowflake] = useState("");
  const [index, setIndex] = useState(-1);
  const [image, setImage] = useState({} as Image);
  const [vote, setVote] = useState(0);

  useEffect(() => { // Set the snowflake from localStorage, or generate a new one if unset
    if (localStorage["snowflake"]) {
      setSnowflake(localStorage["snowflake"]);
    } else {
      fetch("https://dog.jamalam.tech:8002/v0/user/new").then((res) =>
        res.json().then((json) => {
          localStorage["snowflake"] = json.snowflake;
          setSnowflake(json.snowflake);
        })
      );
    }
  }, []);

  useEffect(() => { // Set the index according to either localStorage or the index prop
    if (localStorage["index"] && !indexProp) {
      setIndex(parseInt(localStorage["index"]));
    } else if (!localStorage["index"] && indexProp) {
      localStorage["index"] = indexProp.toString();
      setIndex(indexProp);
    } else if (localStorage["index"] && indexProp) {
      localStorage["index"] = indexProp.toString();
      setIndex(indexProp);
    } else {
      setIndex(0);
    }
  }, [indexProp]);

  useEffect(() => {
    if (snowflake == "" || index == -1) return;

    fetch(
      `https://dog.jamalam.tech:8002/v0/posts/${index}/vote/${vote}/${snowflake}`,
    ).then((res) => {
      res.json().then((json) => {
        setImage({
          url: json.url,
          votes: json.votes,
          voteValue: json.value,
        });
      });
    });
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

  useEffect(() => { // Update the index in localStorage when the index changes
    localStorage["index"] = index.toString();
  }, [index]);

  if (index == -1 || snowflake == "" || !image.url) return <div />; // Wait until our useEffect's have run

  // Change the style of the button based on whether we have voted yet or not
  const leftStyle = image.voteValue == -1 ? "color-yellow-shadow" : "";
  const rightStyle = image.voteValue == 1 ? "color-yellow-shadow" : "";

  return (
    <div class="max-width-800px display-flex justify-content-center align-items-center flex-direction-column">
      <div class="display-flex flex-direction-row pad-bottom-20px">
        <i
          class="fa-solid fa-arrow-left font-size-300p pad-horizontal-20px button-hover-animation"
          onClick={(_) => {
            if (index > 0) {
              setIndex(index - 1);
            }
          }}
        />
        <i
          class="fa-solid fa-arrow-right font-size-300p pad-horizontal-20px button-hover-animation"
          onClick={(_) => {
            setIndex(index + 1);
          }}
        />
      </div>
      <img class="max-height-60vh" src={image.url} key={image.url} />
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
      <h1>{image.votes}</h1>
    </div>
  );
}
