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
      document.getElementById("forward").click();
    } else if (horizontalDifference <= -threshold) {
      document.getElementById("back").click();
    }
  }
}

// Button events
document.getElementById("upvote").addEventListener("click", async () => {
  const index = getIndex();
  const currentValue = await getVote(index, getSnowflake());
  let data;

  if (currentValue == 1) {
    data = await setVote(index, 0, getSnowflake());
  } else {
    data = await setVote(index, 1, getSnowflake());
  }

  updateVoteButtons(data.value);
  updateVoteText(data.votes, data.value);
});

document.getElementById("downvote").addEventListener("click", async () => {
  const index = getIndex();
  const currentValue = await getVote(index, getSnowflake());
  let data;

  if (currentValue == -1) {
    data = await setVote(index, 0, getSnowflake());
  } else {
    data = await setVote(index, -1, getSnowflake());
  }

  updateVoteButtons(data.value);
  updateVoteText(data.votes, data.value);
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

document.getElementById("share").addEventListener("click", async () => {
  // If the browser and OS support the Web Share API, use it; if not, just copy the link to clipboard

  if (navigator.share) {
    navigator.share({
      title: "Doggo!",
      text: "Send this post to your friends!",
      url: createQueryUrl(getIndex()),
    });
  } else {
    await navigator.clipboard.writeText(createQueryUrl(getIndex()));
    alert("Copied to clipboard!");
  }
});

document.getElementById("dog").addEventListener("dblclick", async () => {
  open(document.getElementById("dog").src);
});

document.getElementById("dog-2").addEventListener("dblclick", async () => {
  open(document.getElementById("dog-2").src);
});
