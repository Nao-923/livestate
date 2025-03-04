"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // 🔹 アイコン表示用

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// 🔹 型定義を追加
interface PlayerListResponse {
  playerCount: number;
  maxPlayers: number;
  players: string[];
}

export default function PlayerList() {
  const [list, setList] = useState<PlayerListResponse | null>(null); // 型を適用

  useEffect(() => {
    axios.get<PlayerListResponse>(`${API_BASE}/list`).then((res) => setList(res.data));
  }, []);

  return (
    <section className="bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🟢 オンラインプレイヤー</h2>
      
      {list ? (
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-lg font-semibold text-gray-700 mb-2">
            現在のプレイヤー数: 
            <span className="text-green-600"> {list.playerCount} / {list.maxPlayers}</span>
          </p>

          {list.players.length > 0 ? (
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {list.players.map((player, idx) => (
                <li 
                  key={idx} 
                  className="flex items-center bg-white shadow-md p-3 rounded-lg hover:bg-green-100 transition"
                >
                  <FaUserCircle className="text-green-600 text-2xl mr-2" />
                  <span className="text-gray-800 font-medium">{player}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center mt-2">現在オンラインのプレイヤーはいません</p>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center">⏳ ロード中...</p>
      )}
    </section>
  );
}