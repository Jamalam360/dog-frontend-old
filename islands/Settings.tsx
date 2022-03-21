/** @jsx h */
import { h, useEffect, useState } from "../client_deps.ts";
import { useSettings, useSnowflake } from "../util/hooks.ts";

export interface Settings {
  advanceOnVote: boolean;
  hideTotal: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useSettings();
  const [snowflake, setSnowflake] = useSnowflake();
  const [loginCode, setLoginCode] = useState("");

  useEffect(() => {
    if (snowflake != "unset") {
      fetch(`https://dog.jamalam.tech:8002/v0/user/${snowflake}`).then((
        res,
      ) => res.json().then((json) => setLoginCode(json.loginCode)));
    }
  }, [snowflake]);

  return (
    <div class="display-flex flex-direction-column align-items-center justify-content-center">
      <h1>
        <a href="/">Back</a>
      </h1>

      <div class="display-flex flex-direction-row align-items-center">
        <i
          class={`fa-solid fa-toggle-${
            settings!.advanceOnVote
              ? "on"
              : "off"
          } font-size-225p button-hover-animation pad-horizontal-20px`}
          onClick={(_) => {
            setSettings({
              hideTotal: settings!.hideTotal,
              advanceOnVote: !settings!.advanceOnVote,
            });
          }}
        />
        <h2>Advance on Vote</h2>
      </div>
      <p>Move on to the next image after voting</p>

      <div class="display-flex flex-direction-row align-items-center">
        <i
          class={`fa-solid fa-toggle-${
            settings!.hideTotal ? "on" : "off"
          } font-size-225p button-hover-animation pad-horizontal-20px`}
          onClick={(_) => {
            setSettings({
              hideTotal: !settings!.hideTotal,
              advanceOnVote: settings!.advanceOnVote,
            });
          }}
        />
        <h2>Hide total</h2>
      </div>
      <p>Hide the total number of votes before voting, to prevent bias</p>

      <h2>Login</h2>
      <button
        onClick={(_) => {
          const code = prompt("Enter your login code");
          fetch(
            `https://dog.jamalam.tech:8002/v0/user/login/${code}`,
          ).then((
            res,
          ) => res.json().then((json) => setSnowflake(snowflake)));
        }}
      >
        Enter Login Code
      </button>
      <h3>{`Your login code is ${loginCode}`}</h3>
      <p>Login codes can be used to sync your progress across devices</p>
    </div>
  );
}