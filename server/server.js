import express from "express";
import cors from "cors";
import routes from "./routes.js";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", routes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: err.message });
});

// Chỉ lắng nghe port nếu file được thực thi trực tiếp bằng node server/server.js
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  app.listen(PORT, "127.0.0.1", () => {
    console.log(`🚀 [Backend] Server đang chạy tại http://127.0.0.1:${PORT}`);
  });
}

export default app;
