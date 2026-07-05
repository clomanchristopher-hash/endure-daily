import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Endure Daily",
    short_name: "Endure Daily",
    description:
      "Daily Scripture, devotion, prayer, and movement challenges for Christians building strength in body and spirit.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d1510",
    theme_color: "#0d1510",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
