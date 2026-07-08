import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Static export: generate all routes as static HTML files in the `out/` directory
  // for Capacitor iOS/Android builds. Dynamic routes with [id] require generateStaticParams.
};

export default nextConfig;
