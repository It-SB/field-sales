import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Field Stock Manager",
    short_name: "Stock Manager",
    description:
      "Stock, returns, expiry and fridge reporting for field sales representatives.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#2563eb",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/frozen-brands",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}