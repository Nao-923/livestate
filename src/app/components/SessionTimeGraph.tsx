import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function SessionTimeGraph({ player }: { player: any }) {
  // 24時間のデータを初期化
  const data = Array(24)
    .fill(0)
    .map((_, hour) => ({ hour: `${hour}:00`, count: 0 }));

  // ログイン時間をカウント
  player.sessions.forEach((session: any) => {
    const loginHour = new Date(session.login).getHours();
    data[loginHour].count += 1;
  });

  return (
    <div className="bg-white text-left min-h-[300px] flex flex-col justify-center">
      <h2 className="text-xl font-bold mb-2">プレイ時間帯</h2>
      <ResponsiveContainer width="100%" height="100%" minHeight={250}>
        <BarChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="hour" />
          <YAxis
            allowDecimals={false}
            // label={{
            //   value: "ログイン回数",
            //   offset : 0,
            //   position: "top",
            // }}
          />
          <Tooltip />
          <Bar dataKey="count" fill="#3182CE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}