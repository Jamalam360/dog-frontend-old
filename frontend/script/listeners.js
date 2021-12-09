const body = document.getElementById("body");

// For touch events
const threshold = 50;
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

// Handle key events
window.addEventListener(
  "keydown",
  (event) => {
    if (event.defaultPrevented) {
      return;
    }

    switch (event.key) {
      case "ArrowUp":
        document.getElementById("upvote").click();
        break;
      case "ArrowDown":
        document.getElementById("downvote").click();
        break;
      case "ArrowLeft":
        document.getElementById("back").click();
        break;
      case "ArrowRight":
        document.getElementById("forward").click();
        break;
      default:
        return;
    }

    event.preventDefault();
  },
  true,
);

// Handle touch events
body.addEventListener(
  "touchstart",
  function (event) {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
  },
  false,
);

body.addEventListener(
  "touchend",
  function (event) {
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;
    handleGesture();
  },
  false,
);

function handleGesture() {
  let horizontalDifference = touchStartX - touchEndX;
  let verticalDifference = touchStartY - touchEndY;

  if (Math.abs(horizontalDifference) > Math.abs(verticalDifference)) {
    if (horizontalDifference >= threshold) {
      forward();
    } else if (horizontalDifference <= -threshold) {
      back();
    }
  }
}

// Button events
document.getElementById("upvote").addEventListener("click", async () => {
  const index = getIndex();
  const currentValue = await getVote(index, getSnowflake());
  let data;

  if (currentValue == 0) {
    data = await addVote(index, 1, getSnowflake());
    setVoteButtonActive("upvote", true);
    setVoteButtonActive("downvote", false);
  } else if (currentValue == 1) {
    data = await nullifyVote(index, getSnowflake());
    setVoteButtonActive("upvote", false);
    setVoteButtonActive("downvote", false);
  } else if (currentValue == -1) {
    await nullifyVote(index, getSnowflake());
    data = await addVote(index, 1, getSnowflake());
    setVoteButtonActive("upvote", true);
    setVoteButtonActive("downvote", false);
  }

  addFadeInOutAnimation(
    "votes",
    "vote-shrink",
    "vote-grow",
    (e) => (e.innerHTML = data.votes),
  );
});

document.getElementById("downvote").addEventListener("click", async () => {
  const index = getIndex();
  const currentValue = await getVote(index, getSnowflake());
  let data;

  if (currentValue == 0) {
    data = await addVote(index, -1, getSnowflake());
    setVoteButtonActive("upvote", false);
    setVoteButtonActive("downvote", true);
  } else if (currentValue == -1) {
    data = await nullifyVote(index, getSnowflake());
    setVoteButtonActive("upvote", false);
    setVoteButtonActive("downvote", false);
  } else if (currentValue == 1) {
    await nullifyVote(index, getSnowflake());
    data = await addVote(index, -1, getSnowflake());
    setVoteButtonActive("upvote", false);
    setVoteButtonActive("downvote", true);
  }

  addFadeInOutAnimation(
    "votes",
    "vote-shrink",
    "vote-grow",
    (e) => (e.innerHTML = data.votes),
  );
});

document.getElementById("forward").addEventListener("click", async () => {
  setIndex(getIndex() + 1);
  setImage(getIndex());
});

document.getElementById("back").addEventListener("click", async () => {
  if (getIndex() > 0) {
    setIndex(getIndex() - 1);
    setImage(getIndex());
  }
});
