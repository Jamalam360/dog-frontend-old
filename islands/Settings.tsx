/** @jsx h */
import { h, useEffect, useState } from "../client_deps.ts";

export interface Settings {
  advanceOnVote: boolean;
  hideTotal: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useState(
    { advanceOnVote: false, hideTotal: true } as Settings,
  );

  useEffect(() => { // Set the settings from localStorage, or set a new one if unset
    if (localStorage["settings"]) {
      setSettings(JSON.parse(localStorage["settings"]));
    } else {
      localStorage["settings"] = JSON.stringify(settings);
    }
  }, []);

  useEffect(() => { // Update settings in localStorage every time they change
    localStorage["settings"] = JSON.stringify(settings);
  }, [settings]);

  const advanceOnVoteStyle = settings.advanceOnVote ? "on" : "off";
  const hideTotalStyle = settings.hideTotal ? "on" : "off";

  return (
    <div class="display-flex flex-direction-column align-items-center justify-content-center">
      <h1>
        <a href="/">Back</a>
      </h1>

      <div class="display-flex flex-direction-row align-items-center">
        <i
          class={`fa-solid fa-toggle-${advanceOnVoteStyle} font-size-225p button-hover-animation pad-horizontal-20px`}
          onClick={(_) => {
            setSettings({
              ...settings,
              advanceOnVote: !settings.advanceOnVote,
            });
          }}
        />
        <h2>Advance on Vote</h2>
      </div>
      <p>Move on to the next image after voting</p>

      <div class="display-flex flex-direction-row align-items-center">
        <i
          class={`fa-solid fa-toggle-${hideTotalStyle} font-size-225p button-hover-animation pad-horizontal-20px`}
          onClick={(_) => {
            setSettings({
              ...settings,
              hideTotal: !settings.hideTotal,
            });
          }}
        />
        <h2>Hide total</h2>
      </div>
      <p>Hide the total number of votes before voting, to prevent bias</p>
    </div>
  );
}
