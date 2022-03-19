/** @jsx h */
import { h } from "../client_deps.ts";
import Head from "../components/Head.tsx";
import SettingsIsland from "../islands/Settings.tsx";

export default function Settings() {
  return (
    <div class="display-flex justify-content-center align-items-center flex-direction-column">
      <Head
        title="dog.jamalam.tech"
        description="Vote on dogs at https://dog.jamalam.tech/"
        image=""
      />
      <SettingsIsland />
    </div>
  );
}
