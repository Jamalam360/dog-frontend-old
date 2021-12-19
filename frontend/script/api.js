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

  if (getSettings() == null) {
    setSettings({
      "advanceOnVote": false,
    })
  }

  setImage(getIndex()); // Finally, load the image with the requested index
};

async function toggleVote() {
  const index = getIndex();
  const currentValue = await getVote(index, getSnowflake());

  let data;

  if (currentValue == 0) {
    data = await setVote(index, 1, getSnowflake());
  } else if (currentValue == 1) {
    data = await setVote(index, -1, getSnowflake());
  } else if (currentValue == -1) {
    data = await setVote(index, 1, getSnowflake());
  }

  updateVoteButtons(currentValue);
  updateVoteText(data.votes, currentValue);

  if (getSettings().advanceOnVote) {
    setIndex(getIndex() + 1);
    setTimeout(setImage(getIndex()), 400);
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

    updateVoteButtons(data.value);
    updateVoteText(data.votes, data.value);

    imageInUse = nextImage;
  });
}
