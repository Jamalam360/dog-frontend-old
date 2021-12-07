let imageInUse = "dog";

window.onload = async function () {
  if (!getIndex()) {
    setIndex(0);
  }

  if (getSnowflake() == null) {
    const snowflake = await genSnowflake();
    setSnowflake(snowflake);
  }

  setImage(getIndex());
};

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

function getIndex() {
  return parseInt(localStorage.getItem("index"));
}

function setIndex(value) {
  localStorage.setItem("index", value);
}

function getSnowflake() {
  localStorage.getItem("snowflake");
}

function setSnowflake(snowflake) {
  localStorage.setItem("snowflake", snowflake);
}

async function upVote() {
  const index = getIndex();
  const currentValue = await getVote(index, snowflake);
  let data;

  if (currentValue == 0) {
    data = await addVote(index, 1, snowflake);
    setVoteButtonActive("upvote", true);
    setVoteButtonActive("downvote", false);
  } else if (currentValue == 1) {
    data = await nullifyVote(index, snowflake);
    setVoteButtonActive("upvote", false);
    setVoteButtonActive("downvote", false);
  } else if (currentValue == -1) {
    await nullifyVote(index, snowflake);
    data = await addVote(index, 1, snowflake);
    setVoteButtonActive("upvote", true);
    setVoteButtonActive("downvote", false);
  }

  addFadeInOutAnimation(
    "votes",
    "vote-shrink",
    "vote-grow",
    (e) => (e.innerHTML = data.votes),
  );
}

async function downVote() {
  const index = getIndex();
  const currentValue = await getVote(index, snowflake);
  let data;

  if (currentValue == 0) {
    data = await addVote(index, -1, snowflake);
    setVoteButtonActive("upvote", false);
    setVoteButtonActive("downvote", true);
  } else if (currentValue == -1) {
    data = await nullifyVote(index, snowflake);
    setVoteButtonActive("upvote", false);
    setVoteButtonActive("downvote", false);
  } else if (currentValue == 1) {
    await nullifyVote(index, snowflake);
    data = await addVote(index, -1, snowflake);
    setVoteButtonActive("upvote", false);
    setVoteButtonActive("downvote", true);
  }

  addFadeInOutAnimation(
    "votes",
    "vote-shrink",
    "vote-grow",
    (e) => (e.innerHTML = data.votes),
  );
}

function forward() {
  setIndex(getIndex() + 1);
  setImage(getIndex());
}

function back() {
  if (getIndex() > 0) {
    setIndex(getIndex() - 1);
    setImage(getIndex());
  }
}

async function setImage(index) {
  const data = await getPost(index, snowflake);
  const nextImage = imageInUse == "dog" ? "dog-2" : "dog";

  document.getElementById(nextImage).src = data.url;

  addAnimation(imageInUse, "dog-img-fade-out", () => {
    document.getElementById(imageInUse).classList.add("hidden");
    document.getElementById(nextImage).classList.remove("hidden");
    addAnimation(nextImage, "dog-img-fade-in");

    addFadeInOutAnimation(
      "votes",
      "vote-shrink",
      "vote-grow",
      (e) => (e.innerHTML = data.votes),
    );

    imageInUse = nextImage;

    if (data.value == 1) {
      setVoteButtonActive("upvote", true);
      setVoteButtonActive("downvote", false);
    } else if (data.value == -1) {
      setVoteButtonActive("upvote", false);
      setVoteButtonActive("downvote", true);
    } else {
      setVoteButtonActive("upvote", false);
      setVoteButtonActive("downvote", false);
    }
  });
}
