import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
        {
            source: '/broadcasting/auth',
            destination: 'http://localhost:8084/broadcasting/auth',
        },
    ];
},
};

export default nextConfig;
