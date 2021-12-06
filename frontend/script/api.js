const apiBase = "http://138.68.171.167:3601";

let imageInUse = "dog";

window.onload = function () {
  nextImage();

  if (!getIndex()) {
    setIndex(0);
  }
};

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

function getIndex() {
  return parseInt(localStorage.getItem("index"));
}

function getVoteValue() {
  return localStorage.getItem("voteValue" + getIndex());
}

function setIndex(value) {
  localStorage.setItem("index", value);
}

function setVoteValue(value) {
  localStorage.setItem("voteValue" + getIndex(), value);
}

function upVote() {
  if (getVoteValue() != 1) {
    fetch(apiBase + "/posts/" + getIndex() + "/up", { method: "GET" });

    addFadeInOutAnimation(
      "votes",
      "vote-shrink",
      "vote-grow",
      (e) => (e.innerHTML = parseInt(e.innerHTML) + 1)
    );

    setVoteValue(1);

    setVoteButtonActive("upvote", true);
    setVoteButtonActive("downvote", false);
  } else if (getVoteValue() == 1) {
    fetch(apiBase + "/posts/" + getIndex() + "/down", { method: "GET" });

    addFadeInOutAnimation(
      "votes",
      "vote-shrink",
      "vote-grow",
      (e) => (e.innerHTML = parseInt(e.innerHTML) - 1)
    );

    setVoteValue(0);

    setVoteButtonActive("upvote", false);
    setVoteButtonActive("downvote", false);
  }
}

function downVote() {
  if (getVoteValue() != -1) {
    fetch(apiBase + "/posts/" + getIndex() + "/down", { method: "GET" });

    addFadeInOutAnimation(
      "votes",
      "vote-shrink",
      "vote-grow",
      (e) => (e.innerHTML = parseInt(e.innerHTML) - 1)
    );

    setVoteValue(-1);

    setVoteButtonActive("upvote", false);
    setVoteButtonActive("downvote", true);
  } else if (getVoteValue() == -1) {
    fetch(apiBase + "/posts/" + getIndex() + "/up", { method: "GET" });

    addFadeInOutAnimation(
      "votes",
      "vote-shrink",
      "vote-grow",
      (e) => (e.innerHTML = parseInt(e.innerHTML) + 1)
    );

    setVoteValue(0);

    setVoteButtonActive("upvote", false);
    setVoteButtonActive("downvote", false);
  }
}

function forward() {
  setIndex(getIndex() + 1);
  setTimeout(() => nextImage(), 450);
}

function back() {
  if (getIndex() > 0) {
    setIndex(getIndex() - 1);
    setTimeout(() => nextImage(), 450);
  }
}

async function nextImage() {
  const data = await (
    await fetch(apiBase + "/posts/" + getIndex(), { method: "GET" })
  ).json();
  const src = data.url;
  const votes = data.votes;
  const nextImage = imageInUse == "dog" ? "dog-2" : "dog";

  document.getElementById(nextImage).src = src;

  addAnimation(imageInUse, "dog-img-fade-out", () => {
    document.getElementById(imageInUse).classList.add("hidden");
    document.getElementById(nextImage).classList.remove("hidden");
    addAnimation(nextImage, "dog-img-fade-in");

    addFadeInOutAnimation(
      "votes",
      "vote-shrink",
      "vote-grow",
      (e) => (e.innerHTML = votes)
    );

    imageInUse = nextImage;

    if (getVoteValue() == 1) {
      setVoteButtonActive("upvote", true);
      setVoteButtonActive("downvote", false);
    } else if (getVoteValue() == -1) {
      setVoteButtonActive("upvote", false);
      setVoteButtonActive("downvote", true);
    } else {
      setVoteButtonActive("upvote", false);
      setVoteButtonActive("downvote", false);
    }
  });
}
