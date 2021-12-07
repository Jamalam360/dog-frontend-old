const apiBase = "http://138.68.171.167:3601";
//const apiBase = "http://localhost:3601";

async function genSnowflake() {
  const req = await fetch(apiBase + "/user/new")
  const data = await req.json();
  return data.snowflake;
}

async function getPost(index) {
  const req = await fetch(apiBase + "/posts/" + index + "/" + getSnowflake(), { method: "GET" });
  const data = await req.json();
  return data;
}

async function getVote(index) {
  let req = await fetch(apiBase + "/posts/" + index+ "/" + getSnowflake(), { method: "GET" });
  let data = await req.json();
  return data.value;
}

async function addVote(index, value) {
  let option = "";

  if (value == 1) {
    option = "up";
  } else if (value == -1) {
    option = "down";
  }

  const req = await fetch(apiBase + "/posts/" + index + "/" + option + "/" + getSnowflake(), {
    method: "GET",
  });
  const data = await req.json();
  return data;
}

async function nullifyVote(index) {
  const req = await fetch(apiBase + "/posts/" + index + "/removeVote"+ "/" + getSnowflake(), {
    method: "GET",
  });
  const data = await req.json();
  return data;
}
