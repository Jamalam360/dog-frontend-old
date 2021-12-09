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
  // This is a temporary method, once the site uses HTTPS, we can use the provided methods

  const textArea = document.createElement("textarea");
  textArea.textContent = "http://dog.jamalam.tech/?index=" + getIndex();
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
    alert("Copied to clipboard");
  } catch (ex) {
    console.warn("Copy to clipboard failed.", ex);
    alert("Failed to copy to clipboard");
  } finally {
    document.body.removeChild(textArea);
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

  document.querySelector('meta[name="description"]').setAttribute("content", data.votes + " votes");
  document.querySelector('meta[name="url"]').setAttribute("content", "http://dog.jamalam.tech/?index=" + index);
  document.querySelector('meta[name="image"]').setAttribute("content", document.getElementById(imageInUse).src);
}
