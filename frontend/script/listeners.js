const body = document.getElementById("body");

let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

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

body.addEventListener('touchstart', function (event) {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
}, false);

body.addEventListener('touchend', function (event) {
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;
    handleGesture();
}, false);


function handleGesture() {
    if (touchEndX < touchStartX) {
        console.log('Swiped Left');
    }

    if (touchEndX > touchStartX) {
        console.log('Swiped Right');
    }

    if (touchEndY < touchStartY) {
        console.log('Swiped Up');
    }

    if (touchEndY > touchStartY) {
        console.log('Swiped Down');
    }

    if (touchEndY === touchStartY) {
        console.log('Tap');
    }
}