import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: ["favicon.svg", "icons/*.png"],

      manifest: {
        name: "Pokecapt",
        short_name: "PokeCapt",
        description: "Jeu de capture de Pokémon en PWA",
        theme_color: "#7977cc",
        background_color: "#F7F5FF",
        display: "standalone",
        start_url: "/",

        icons: [
          {
            src: "/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },

        ],
      },

     workbox: {
  navigateFallback: "/index.html",

  runtimeCaching: [
    {
      urlPattern: ({ url }) =>
        url.hostname.includes("pokeapi.co") ||
        url.hostname.includes("tcgdex.net"),

      handler: "NetworkFirst",

      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24,
        },
      },
    },
  ],
},

    }),
  ],
});
