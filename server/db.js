import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tạo thư mục data nếu chưa tồn tại
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "finance.sqlite");
const db = new DatabaseSync(dbPath);

// Kích hoạt foreign keys và tối ưu hiệu năng WAL mode
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Khởi tạo bảng transactions (Giao dịch thu chi)
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    note TEXT DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Khởi tạo bảng budgets (Hạn mức ngân sách theo tháng)
db.exec(`
  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month TEXT NOT NULL UNIQUE,
    limit_amount REAL NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Khởi tạo bảng categories (Danh mục thu chi tùy chỉnh)
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    emoji TEXT NOT NULL DEFAULT '📌',
    color TEXT DEFAULT 'from-slate-400 to-slate-600',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, type)
  );
`);

// Seed danh mục mặc định nếu chưa có
const catCount = db.prepare("SELECT COUNT(*) as count FROM categories").get();
if (catCount.count === 0) {
  const insertCat = db.prepare(`
    INSERT OR IGNORE INTO categories (name, type, emoji, color)
    VALUES (?, ?, ?, ?)
  `);

  const defaultExpenses = [
    ["Trà sữa / Cà phê", "expense", "🧋", "from-amber-400 to-orange-500"],
    ["Ăn uống", "expense", "🍜", "from-orange-400 to-rose-500"],
    ["Mua sắm", "expense", "🛍️", "from-pink-400 to-rose-500"],
    ["Tiền trọ / Nhà", "expense", "🏠", "from-blue-400 to-indigo-500"],
    ["Đi lại", "expense", "🛵", "from-emerald-400 to-teal-500"],
    ["Học tập", "expense", "📚", "from-violet-400 to-purple-500"],
    ["Giải trí", "expense", "🎮", "from-cyan-400 to-blue-500"],
    ["Thú cưng", "expense", "🐱", "from-amber-400 to-yellow-500"],
    ["Khác", "expense", "📌", "from-slate-400 to-slate-600"],
  ];

  const defaultIncomes = [
    ["Lương", "income", "💼", "from-emerald-400 to-green-600"],
    ["Làm thêm", "income", "⏳", "from-teal-400 to-emerald-600"],
    ["Thưởng", "income", "🎁", "from-amber-400 to-yellow-500"],
    ["Gia đình hỗ trợ", "income", "💖", "from-pink-400 to-rose-500"],
    ["Đầu tư", "income", "📈", "from-blue-400 to-cyan-500"],
    ["Khác", "income", "✨", "from-slate-400 to-slate-600"],
  ];

  defaultExpenses.forEach(([name, type, emoji, color]) => insertCat.run(name, type, emoji, color));
  defaultIncomes.forEach(([name, type, emoji, color]) => insertCat.run(name, type, emoji, color));
}

// Seed dữ liệu mẫu nếu chưa có dữ liệu (Dành riêng cho giới trẻ / Gen Z)
const countCheck = db.prepare("SELECT COUNT(*) as count FROM transactions").get();
if (countCheck.count === 0) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];

  const insertTx = db.prepare(`
    INSERT INTO transactions (title, amount, type, category, date, note)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertTx.run("Lương làm thêm / Part-time", 5500000, "income", "Lương", today, "Lương tháng này");
  insertTx.run("Trà sữa Koi Thé & Ăn vặt", 65000, "expense", "Trà sữa / Cà phê", today, "Cùng bạn bè");
  insertTx.run("Tiền phòng trọ & Điện nước", 2200000, "expense", "Tiền trọ / Nhà", yesterday, "Tiền trọ tháng này");
  insertTx.run("Đổ xăng xe máy", 70000, "expense", "Đi lại", yesterday, "Đầy bình xăng");
  insertTx.run("Ăn lẩu cuối tuần cùng bạn bè", 180000, "expense", "Ăn uống", threeDaysAgo, "Đi ăn Haidilao share bill");
  insertTx.run("Săn sale Shopee đồ decor phòng", 125000, "expense", "Mua sắm", threeDaysAgo, "Mua kệ sách nhỏ");
  insertTx.run("Thưởng phụ cấp dự án nhỏ", 500000, "income", "Khác", threeDaysAgo, "Tiền tip dự án");

  // Seed hạn mức ngân sách tháng hiện tại: 4.500.000đ
  const currentMonth = today.slice(0, 7);
  const insertBudget = db.prepare(`
    INSERT OR REPLACE INTO budgets (month, limit_amount)
    VALUES (?, ?)
  `);
  insertBudget.run(currentMonth, 4500000);
}

export default db;
