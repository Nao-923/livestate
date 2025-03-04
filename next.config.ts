import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",  // フロントエンドの /api 経由でアクセス
        destination: "http://100.118.122.34:3005/:path*", // LiveAPI に転送
      },
    ];
  },
};

export default nextConfig;