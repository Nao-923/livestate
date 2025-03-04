// セッションログエントリの型
export interface SessionLogEntry {
    properties: {
        Name: { title: { text: { content: string } }[] };
        Event: { select: { name: string } };
        Timestamp: { date: { start: string } };
    };
}

// プレイヤーごとの処理済みセッションデータ
export interface ProcessedSessionLog {
    player: string;
    totalTime: number; // 総プレイ時間（分単位）
    sessionCount: number;
    sessions: { login: string; logout: string; duration: number }[];
}

// 日本時間に変換（秒を含めず YYYY-MM-DD HH:mm 形式）
const formatToJST = (date: Date): string => {
    return date.toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).replace(/\//g, "-"); // YYYY-MM-DD HH:mm 形式に統一
};

// ログ処理関数
export const processSessionLogs = (logs: SessionLogEntry[]): ProcessedSessionLog[] => {
    const sessions: Record<string, { totalTime: number; sessionCount: number; sessions: { login: string; logout: string; duration: number }[] }> = {};

    // 🔹 プレイヤーごとに分類
    const playersLogs: Record<string, SessionLogEntry[]> = {};
    logs.forEach((log) => {
        const player = log.properties.Name.title[0]?.text.content || "Unknown";
        if (!playersLogs[player]) playersLogs[player] = [];
        playersLogs[player].push(log);
    });

    // 🔹 各プレイヤーのセッションを処理
    Object.entries(playersLogs).forEach(([player, logs]) => {
        // 時系列順にソート
        logs.sort((a, b) =>
            new Date(a.properties.Timestamp.date.start).getTime() -
            new Date(b.properties.Timestamp.date.start).getTime()
        );

        let totalTime = 0;
        let sessionCount = 0;
        let sessionData: { login: string; logout: string; duration: number }[] = [];
        let eventQueue: { event: string; timestamp: Date }[] = [];

        console.log(`プレイヤー: ${player} のログ:`, logs);

        logs.forEach((log) => {
            const event = log.properties.Event.select.name;
            const timestamp = new Date(log.properties.Timestamp.date.start);
            eventQueue.push({ event, timestamp });
        });

        // 🔹 `join` `left` をペアリングしてセッションを作成
        while (eventQueue.length >= 2) {
            const first = eventQueue.shift();
            const second = eventQueue.shift();

            if (!first || !second) break;

            const login = first.event === "join" ? first.timestamp : second.timestamp;
            const logout = first.event === "left" ? first.timestamp : second.timestamp;

            // `left - join` でプレイ時間計算（分単位）
            const durationMin = Math.max(0, Math.floor((logout.getTime() - login.getTime()) / (1000 * 60)));

            sessionData.push({
                login: formatToJST(login),
                logout: formatToJST(logout),
                duration: durationMin,
            });

            console.log(`JOIN: ${formatToJST(login)}, LEFT: ${formatToJST(logout)}, プレイ時間: ${durationMin}分`);

            totalTime += durationMin;
            sessionCount++;
        }

        // 🔹 `join` が余った場合は、未ログアウトとして現在時刻を仮の `left` にする
        if (eventQueue.length === 1) {
            const last = eventQueue.shift();
            if (last?.event === "join") {
                const now = new Date();
                const durationMin = Math.max(0, Math.floor((now.getTime() - last.timestamp.getTime()) / (1000 * 60)));

                sessionData.push({
                    login: formatToJST(last.timestamp),
                    logout: "未ログアウト",
                    duration: durationMin,
                });

                console.log(`未ログアウト: ${formatToJST(last.timestamp)}, 仮のLEFT: ${formatToJST(now)}, プレイ時間: ${durationMin}分`);

                totalTime += durationMin;
                sessionCount++;
            }
        }

        sessions[player] = { totalTime, sessionCount, sessions: sessionData };
    });

    return Object.entries(sessions).map(([player, data]) => ({
        player,
        totalTime: data.totalTime,
        sessionCount: data.sessionCount,
        sessions: data.sessions,
    }));
};