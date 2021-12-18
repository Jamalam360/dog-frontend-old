// deno-lint-ignore-file no-unused-vars

const apiBase = "https://dog.jamalam.tech:8002/v0";
//const apiBase = "http://localhost:8002";

async function genSnowflake() {
  const req = await fetch(apiBase + "/user/new");
  const data = await req.json();
  return data.snowflake;
}

async function getPost(index, snowflake) {
  const req = await fetch(apiBase + "/posts/" + index + "/" + snowflake);
  const data = await req.json();
  return data;
}

async function getVote(index, snowflake) {
  const req = await fetch(apiBase + "/posts/" + index + "/" + snowflake);
  const data = await req.json();
  return data.value;
}

async function setVote(index, value, snowflake) {
  const req = await fetch(
    apiBase + "/posts/" + index + "/vote/" + value + "/" + snowflake,
  );
  const data = await req.json();
  return data;
}
