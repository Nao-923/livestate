"use client";
import { useEffect, useState } from "react";
import { fetchSessionLog } from "../utils/fetchLogs";
import { ProcessedSessionLog, processSessionLogs, SessionLogEntry } from "../utils/processLogs";
import PlayerCard from "./PlayerCard";

export default function SessionLog() {
  const [sessionLog, setSessionLog] = useState<ProcessedSessionLog[]>([]);

  useEffect(() => {
    fetchSessionLog()
      .then((data: SessionLogEntry[]) => {
        console.log("取得したセッションログ:", data);
        const processedData = processSessionLogs(data);
        console.log("処理後のデータ:", processedData);
        setSessionLog(processedData);
      })
      .catch((error) => console.error("セッションログの取得に失敗:", error));
  }, []);

  return (
    <section className="md:col-span-2 bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">セッションログ</h2>
      {sessionLog.length > 0 ? (
        <div className="flex flex-col space-y-6">
          {sessionLog.map((playerData, idx) => (
            <PlayerCard key={idx} playerData={playerData} />
          ))}
        </div>
      ) : (
        <p className="text-center">ログなし</p>
      )}
    </section>
  );
}