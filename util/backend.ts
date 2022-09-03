export interface Image {
  url?: string;
  votes?: number;
  voteValue?: number;
}

export async function getImage(
  index: number,
  snowflake: string,
): Promise<Image> {
  const res = await fetch(
    `https://dog.jamalam.tech/v0/posts/${index}`,
    {
      headers: {
        "Snowflake": snowflake,
      },
    },
  );

  const json = await res.json();

  return {
    url: json.url,
    votes: json.votes,
    voteValue: json.value,
  };
}

export async function vote(
  index: number,
  snowflake: string,
  vote: "up" | "none" | "down",
): Promise<Image> {
  const voteNumber = vote == "up" ? 1 : (vote == "down") ? -1 : 0;
  const res = await fetch(
    `https://dog.jamalam.tech/v0/posts/${index}`,
    {
      method: "POST",
      headers: {
        "Snowflake": snowflake,
      },
      body: JSON.stringify({
        vote: voteNumber,
      }),
    },
  );

  const json = await res.json();

  return {
    url: json.url,
    votes: json.votes,
    voteValue: json.value,
  };
}

export async function getUserLoginCode(snowflake: string): Promise<string> {
  const res = await fetch(`https://dog.jamalam.tech/v0/user`, {
    headers: {
      Snowflake: snowflake,
    },
  });
  const json = await res.json();
  return json.loginCode;
}

export async function getUserIndex(snowflake: string): Promise<number> {
  const res = await fetch(`https://dog.jamalam.tech/v0/user`, {
    headers: {
      Snowflake: snowflake,
    },
  });
  const json = await res.json();
  return json.index;
}

export function setUserIndex(index: number, snowflake: string) {
  fetch(`https://dog.jamalam.tech/v0/user`, {
    method: "POST",
    headers: {
      Snowflake: snowflake,
    },
    body: JSON.stringify({
      index: index,
    }),
  });
}
