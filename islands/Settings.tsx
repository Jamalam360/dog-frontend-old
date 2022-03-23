/** @jsx h */
import { h, useEffect, useState } from "../client_deps.ts";
import { useSettings, useSnowflake } from "../util/hooks.ts";
import { getUserLoginCode } from "../util/backend.ts";

export interface Settings {
  advanceOnVote: boolean;
  hideTotal: boolean;
}

export default function Settings(
  { region, deploymentId }: { region: string; deploymentId: string },
) {
  const [settings, setSettings] = useSettings();
  const [snowflake, setSnowflake] = useSnowflake();
  const [loginCode, setLoginCode] = useState("");

  useEffect(() => {
    if (snowflake != "unset") {
      getUserLoginCode(snowflake).then(setLoginCode);
    }
  }, [snowflake]);

  if (!settings) return <div />;

  return (
    <div class="display-flex flex-direction-column align-items-center justify-content-center margin-top-6px">
      <h1 class="margin-top-6px">
        <a href="/">Back</a>
      </h1>

      <p class="text-align-center margin-top-6px">
        <a href="https://github.com/dog-jamalam-tech/frontend">Source</a>
        <br />
        Deployment Region: {region} - Deployment ID: {deploymentId}
      </p>

      <div
        class="display-flex flex-direction-row align-items-center button-hover-animation unselectable cursor-pointer margin-top-6px"
        onClick={(_) => {
          setSettings({
            hideTotal: settings!.hideTotal,
            advanceOnVote: !settings!.advanceOnVote,
          });
        }}
      >
        <i
          class={`fa-solid fa-toggle-${
            settings!.advanceOnVote
              ? "on"
              : "off"
          } font-size-225p pad-horizontal-20px`}
        />
        <h2>Advance on Vote</h2>
      </div>
      <p class="margin-top-6px">Move on to the next image after voting</p>

      <div
        class="display-flex flex-direction-row align-items-center button-hover-animation unselectable cursor-pointer margin-top-6px"
        onClick={(_) => {
          setSettings({
            hideTotal: !settings!.hideTotal,
            advanceOnVote: settings!.advanceOnVote,
          });
        }}
      >
        <i
          class={`fa-solid fa-toggle-${
            settings!.hideTotal ? "on" : "off"
          } font-size-225p button-hover-animation pad-horizontal-20px`}
        />
        <h2>Hide total</h2>
      </div>
      <p class="margin-top-6px">
        Hide the total number of votes before voting, to prevent bias
      </p>

      <h2 class="margin-top-6px">Login</h2>
      <button
        class="margin-top-6px"
        onClick={(_) => {
          const code = prompt("Enter your login code");
          console.log(code);

          if (!code) {
            alert("Please enter a code");
            return;
          }

          if (code?.length != 6) {
            alert("Invalid code");
            return;
          }

          fetch(
            `https://dog.jamalam.tech:8002/v0/user/login/${
              code?.toUpperCase()
            }`,
          ).then((
            res,
          ) => {
            if (res.status == 404) {
              alert("Invalid code");
              return;
            }

            res.json().then((json) => {
              setSnowflake(json.snowflake);
            });
          });
        }}
      >
        Enter Login Code
      </button>
      <h3 class="margin-top-6px">{`Your login code is ${loginCode}`}</h3>
      <p class="margin-top-6px">
        Login codes can be used to sync your progress across devices
      </p>
    </div>
  );
}
