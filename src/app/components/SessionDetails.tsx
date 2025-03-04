import { useState } from "react";

export default function SessionDetails({ player }:{ player:any }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white text-left">
      <h2 className="text-xl font-bold mb-2">セッション時間</h2>
      <p>合計プレイ時間: {player.totalTime}分</p>
      <p>ログイン回数: {player.sessionCount}回</p>
      
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        {showDetails ? "セッション詳細" : "閉じる"}
      </button>
      
      {showDetails == false && (
        <ul className="mt-2 text-sm text-gray-700">
          {player.sessions.map((session:any, index: number) => (
            <li key={index} className="mt-1">
              {session.login} → {session.logout} ({session.duration}分)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}