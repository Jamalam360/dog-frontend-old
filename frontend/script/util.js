// deno-lint-ignore-file no-unused-vars

function getIndex() {
  return parseInt(localStorage.index);
}

function setIndex(value) {
  localStorage.setItem("index", value);
}

function getSnowflake() {
  return localStorage.snowflake;
}

function setSnowflake(snowflake) {
  localStorage.setItem("snowflake", snowflake);
}

function createQueryUrl(index) {
  return "https://dog.jamalam.tech/" + "?index=" + index;
}

function updateVoteButtons(value) {
  if (value == 1) {
    setVoteButtonActive("upvote", true);
    setVoteButtonActive("downvote", false);
  } else if (value == -1) {
    setVoteButtonActive("upvote", false);
    setVoteButtonActive("downvote", true);
  } else {
    setVoteButtonActive("upvote", false);
    setVoteButtonActive("downvote", false);
  }
}

function updateVoteText(currentVote, voteValue) {
  var newValue;
  console.log(voteValue);

  if (voteValue == 0 || !voteValue) {
    newValue = "?";
  } else {
    newValue = currentVote;
  }

  addFadeInOutAnimation(
    "votes",
    "vote-shrink",
    "vote-grow",
    (e) => (e.innerHTML = newValue),
  );
}
