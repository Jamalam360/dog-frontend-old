const body = document.getElementById("body");
const threshold = 50;

let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let tapped = false;

window.addEventListener(
  "keydown",
  (event) => {
    if (event.defaultPrevented) {
      return;
    }

    switch (event.key) {
      case "ArrowUp":
        upVote();
        break;
      case "ArrowDown":
        downVote();
        break;
      case "ArrowLeft":
        back();
        break;
      case "ArrowRight":
        forward();
        break;
      default:
        return;
    }

    event.preventDefault();
  },
  true
);

body.addEventListener(
  "touchstart",
  function (event) {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
  },
  false
);

body.addEventListener(
  "touchend",
  function (event) {
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;
    handleGesture();
  },
  false
);

function handleGesture() {
  let horizontalDifference = touchStartX - touchEndX;
  let verticalDifference = touchStartY - touchEndY;

  if (Math.abs(horizontalDifference) > Math.abs(verticalDifference)) {
    tapped = false;

    if (horizontalDifference >= threshold) {
      forward();
    } else if (horizontalDifference <= -threshold) {
      back();
    }
  } else if (Math.abs(verticalDifference) > Math.abs(horizontalDifference)) {
    tapped = false;
  } else {
    tapped = true;
  }

  if (tapped) {
      toggleVote();
  }
}
