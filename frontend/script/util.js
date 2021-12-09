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
