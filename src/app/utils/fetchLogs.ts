import axios from "axios";
import { SessionLogEntry } from "./processLogs";

const API_BASE = "/api";

export const fetchList = async () => {
  const res = await axios.get(`${API_BASE}/list`);
  return res.data;
};

export const fetchSessionLog = async (): Promise<SessionLogEntry[]> => {
  try {
    const res = await axios.get(`${API_BASE}/sessionlog`);
    console.log("取得したデータ:", res.data); // デバッグ用
    if (!Array.isArray(res.data)) {
      throw new Error("レスポンスが配列ではありません");
    }
    return res.data as SessionLogEntry[];
  } catch (error) {
    console.error("fetchSessionLog エラー:", error);
    return [];
  }
};

export const fetchBotLog = async () => {
  const res = await axios.get(`${API_BASE}/botlog`);
  return res.data;
};