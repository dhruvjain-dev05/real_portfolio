import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the banner films, posters and sprites never change under the same name
  // (a new render gets a new name or a ?v= bump), so let browsers keep them
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    return [
      { source: "/banner/:path*", headers: cache },
      { source: "/sprites/:path*", headers: cache },
    ];
  },
};

export default nextConfig;
