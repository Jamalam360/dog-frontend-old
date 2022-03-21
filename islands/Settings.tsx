/** @jsx h */
import { h } from "../client_deps.ts";
import { useLocalStorageBackedState } from "../util/hooks.ts";

export interface Settings {
  advanceOnVote: boolean;
  hideTotal: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useLocalStorageBackedState<Settings>(
    "settings",
    {
      defaultValue: { advanceOnVote: false, hideTotal: false },
    },
  );

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
    </div>
  );
}
