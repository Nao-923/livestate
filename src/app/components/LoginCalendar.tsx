import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface PlayerData {
  sessions: { login: string; logout: string; duration: number }[];
}

export default function LoginCalendar({ player }: { player: PlayerData }) {
  const loginDates = player.sessions.map((session) => {
    // 日本時間に変換 (UTC のズレを補正)
    const loginDate = new Date(session.login);
    return loginDate.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" });
  });

  // 日付ごとのログイン回数を集計
  const loginCounts: Record<string, number> = loginDates.reduce((acc: Record<string, number>, date: string) => {
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // 最大ログイン回数を取得（0なら1にする）
  const maxLoginCount = Math.max(...Object.values(loginCounts), 1);

  return (
    <div className="bg-white text-left">
      <h2 className="text-xl font-bold mb-2">ログイン履歴</h2>
      <Calendar
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          // カレンダーの日付を日本時間で取得
          const dateString = date.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" });
          const count = loginCounts[dateString] || 0;

          if (count > 0) {
            // 緑系の濃淡（最大値を基準にする）
            const intensity = Math.round((count / maxLoginCount) * 180) + 50;
            return (
              <div
                style={{
                  backgroundColor: `rgb(0, ${intensity}, 0)`,
                  borderRadius: "5px",
                  width: "90%",
                  height: "90%",
                  margin: "auto",
                }}
              />
            );
          }
          return null;
        }}
        formatShortWeekday={(locale, date) => {
          const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
          return weekdays[date.getDay()]; // `<span>` タグを削除し、string のみを返す
        }}
        tileClassName={({ date }) => {
          const day = date.getDay();
          if (day === 0) return "text-red-500"; // 日曜日を赤
          if (day === 6) return "text-blue-500"; // 土曜日を青
          return "";
        }}
      />
    </div>
  );
}