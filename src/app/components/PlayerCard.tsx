import LoginCalendar from "./LoginCalendar";
import SessionDetails from "./SessionDetails";
import SessionTimeGraph from "./SessionTimeGraph";

export default function PlayerCard({ playerData }: { playerData: any }) {
  return (
    <div className="bg-white p-6 rounded-lg w-full">
      {/* プレイヤー名を中央揃え */}
      <h2 className="text-2xl font-bold text-left mb-4">{playerData.player}</h2>

      {/* 画面横幅いっぱいを使って3分割 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左側: セッション情報 */}
        <SessionDetails player={playerData} />

        {/* 真ん中: プレイ時間帯グラフ */}
        <SessionTimeGraph player={playerData} />

        {/* 右側: ログイン履歴カレンダー */}
        <LoginCalendar player={playerData} />
      </div>
    </div>
  );
}