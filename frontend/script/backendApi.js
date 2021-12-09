// deno-lint-ignore-file no-unused-vars

const apiBase = "http://dog.jamalam.tech:8002";
//const apiBase = "http://localhost:8002";

async function genSnowflake() {
  const req = await fetch(apiBase + "/user/new");
  const data = await req.json();
  return data.snowflake;
}

async function getPost(index, snowflake) {
  const req = await fetch(apiBase + "/posts/" + index + "/" + snowflake, {
    method: "GET",
  });
  const data = await req.json();
  return data;
}

async function getVote(index, snowflake) {
  const req = await fetch(apiBase + "/posts/" + index + "/" + snowflake, {
    method: "GET",
  });
  const data = await req.json();
  return data.value;
}

async function addVote(index, value, snowflake) {
  let option = "";

  if (value == 1) {
    option = "up";
  } else if (value == -1) {
    option = "down";
  }

  const req = await fetch(
    apiBase + "/posts/" + index + "/" + option + "/" + snowflake,
    {
      method: "GET",
    },
  );
  const data = await req.json();
  return data;
}

async function nullifyVote(index, snowflake) {
  const req = await fetch(
    apiBase + "/posts/" + index + "/removeVote" + "/" + snowflake,
    {
      method: "GET",
    },
  );
  const data = await req.json();
  return data;
}
