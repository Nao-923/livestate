"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// 🔹 型定義
interface BotLogEntry {
  properties: {
    User: { title: { text: { content: string } }[] };
    UserID: { rich_text: { text: { content: string } }[] };
    Command: { rich_text: { text: { content: string } }[] };
    Timestamp: { date: { start: string } };
  };
}

export default function BotLogChart() {
  const [botLog, setBotLog] = useState<BotLogEntry[]>([]);
  const [userCommandCounts, setUserCommandCounts] = useState<{ name: string; count: number }[]>([]);
  const [hourlyUsage, setHourlyUsage] = useState<{ hour: string; count: number }[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE}/botlog`).then((res) => {
      const data = res.data as BotLogEntry[];

      // 🔹 ユーザーごとのコマンド使用回数
      const userCounts: Record<string, number> = {};
      const hourlyCounts: Record<number, number> = {};

      data.forEach((log) => {
        const user = log.properties.User.title[0]?.text.content || "Unknown";
        userCounts[user] = (userCounts[user] || 0) + 1;

        const timestamp = new Date(log.properties.Timestamp.date.start);
        const hour = timestamp.getHours();
        hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
      });

      setUserCommandCounts(Object.entries(userCounts).map(([name, count]) => ({ name, count })));
      setHourlyUsage(
        Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}:00`,
          count: hourlyCounts[i] || 0,
        }))
      );
    });
  }, []);

  return (
    <section className="bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Bot コマンド使用統計</h2>

      {/* 🔹 ユーザーごとのコマンド使用回数 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">ユーザーごとのコマンド使用回数</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userCommandCounts} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 時間帯ごとのコマンド使用頻度 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">時間帯ごとのコマンド使用頻度</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyUsage} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}