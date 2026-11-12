import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("error", (err, _req, res) => {
            // Khi Backend chưa bật (ECONNREFUSED), trả về JSON thay vì spam stack trace lỗi
            if (err.code === "ECONNREFUSED" && res.writeHead && !res.headersSent) {
              res.writeHead(503, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, message: "Backend offline" }));
            }
          });
        },
      },
    },
  },
});
