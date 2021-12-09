// deno-lint-ignore-file no-unused-vars

let imageInUse = "dog";

window.onload = async function () {
  // Handle query parameters (index)

  const params = window.location.search.substr(1).split("&"); // Get parameters as an array of key=value
  const arr = params[0].split("=");
  let requestedIndex = null;

  if (arr[0] == "index") { // Check we aren't just using any random parameter
    requestedIndex = params[0].split("=")[1];
  }

  if (requestedIndex) { // If there is an index parameter, assign it
    setIndex(requestedIndex);
  } else { // Else, if we haven't aready got an index, set it to zero
    if (!getIndex()) {
      setIndex(0);
    }
  }

  if (getSnowflake() == null) { // Generate and set snowflake, if not set already
    setSnowflake(await genSnowflake());
  }

  setImage(getIndex()); // Finally, load the image with the requested index
};

function share() {
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
}

async function toggleVote() {
  const index = getIndex();
  const currentValue = await getVote(index, getSnowflake());

  let data;

  if (currentValue == 0) {
    data = await addVote(index, 1, getSnowflake());
    setVoteButtonActive("upvote", true);
    setVoteButtonActive("downvote", false);
  } else if (currentValue == 1) {
    await nullifyVote(index, getSnowflake());
    data = await addVote(index, -1, getSnowflake());
    setVoteButtonActive("upvote", false);
    setVoteButtonActive("downvote", true);
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
    (e) => (e.innerHTML = data.votes)
  );
}

async function upVote() {
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
    (e) => (e.innerHTML = data.votes)
  );
}

async function downVote() {
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
    (e) => (e.innerHTML = data.votes)
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
  const data = await getPost(index, getSnowflake());
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
      (e) => (e.innerHTML = data.votes)
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
