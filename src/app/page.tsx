"use client";
import BotLog from "./components/BotLog";
import PlayerList from "./components/PlayerList";
import SessionLog from "./components/SessionLog";

export default function LiveStateDashboard() {
  return (
    <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <PlayerList />
      <BotLog />
      <SessionLog />
    </main>
  );
}