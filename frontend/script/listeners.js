window.addEventListener("keydown", event => {
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
}, true);