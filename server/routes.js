import { Router } from "express";
import db from "./db.js";

const router = Router();

// 1. Lấy danh sách giao dịch (Có hỗ trợ lọc theo loại, danh mục, thời gian, tìm kiếm)
router.get("/transactions", (req, res) => {
  try {
    const { type, category, search, month, startDate, endDate } = req.query;

    let sql = "SELECT * FROM transactions WHERE 1=1";
    const params = [];

    if (type && (type === "income" || type === "expense")) {
      sql += " AND type = ?";
      params.push(type);
    }

    if (category && category !== "Tất cả") {
      sql += " AND category = ?";
      params.push(category);
    }

    if (search && search.trim() !== "") {
      sql += " AND (title LIKE ? OR note LIKE ?)";
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (month) {
      sql += " AND date LIKE ?";
      params.push(`${month}%`);
    }

    if (startDate) {
      sql += " AND date >= ?";
      params.push(startDate);
    }

    if (endDate) {
      sql += " AND date <= ?";
      params.push(endDate);
    }

    sql += " ORDER BY date DESC, id DESC";

    const rows = db.prepare(sql).all(...params);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Thêm mới giao dịch
router.post("/transactions", (req, res) => {
  try {
    const { title, amount, type, category, date, note } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Tên khoản thu/chi không được để trống" });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: "Số tiền phải lớn hơn 0" });
    }

    if (!type || !["income", "expense"].includes(type)) {
      return res.status(400).json({ success: false, message: "Loại giao dịch phải là 'income' hoặc 'expense'" });
    }

    const txDate = date || new Date().toISOString().split("T")[0];
    const txCategory = category || (type === "income" ? "Lương" : "Khác");
    const txNote = note || "";

    const stmt = db.prepare(`
      INSERT INTO transactions (title, amount, type, category, date, note)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(title.trim(), numericAmount, type, txCategory, txDate, txNote);
    const newTx = db.prepare("SELECT * FROM transactions WHERE id = ?").get(result.lastInsertRowid);

    res.status(201).json({ success: true, data: newTx, message: "Thêm giao dịch thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Cập nhật giao dịch
router.put("/transactions/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type, category, date, note } = req.body;

    const existing = db.prepare("SELECT * FROM transactions WHERE id = ?").get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Không tìm thấy giao dịch" });
    }

    const stmt = db.prepare(`
      UPDATE transactions
      SET title = COALESCE(?, title),
          amount = COALESCE(?, amount),
          type = COALESCE(?, type),
          category = COALESCE(?, category),
          date = COALESCE(?, date),
          note = COALESCE(?, note)
      WHERE id = ?
    `);

    stmt.run(
      title ? title.trim() : null,
      amount ? Number(amount) : null,
      type || null,
      category || null,
      date || null,
      note !== undefined ? note : null,
      id
    );

    const updated = db.prepare("SELECT * FROM transactions WHERE id = ?").get(id);
    res.json({ success: true, data: updated, message: "Cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Xóa giao dịch
router.delete("/transactions/:id", (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare("SELECT * FROM transactions WHERE id = ?").get(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: "Không tìm thấy giao dịch cần xóa" });
    }

    db.prepare("DELETE FROM transactions WHERE id = ?").run(id);
    res.json({ success: true, message: "Đã xóa giao dịch thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Thống kê tổng quan & phân bổ chi tiêu
router.get("/stats", (req, res) => {
  try {
    const { month } = req.query; // YYYY-MM
    const currentMonth = month || new Date().toISOString().slice(0, 7);

    // Tính tổng thu, tổng chi toàn thời gian hoặc theo tháng
    const totals = db.prepare(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as totalIncome,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as totalExpense
      FROM transactions
      WHERE date LIKE ?
    `).get(`${currentMonth}%`);

    const balance = totals.totalIncome - totals.totalExpense;

    // Phân bổ chi tiêu theo từng danh mục trong tháng
    const categoryBreakdown = db.prepare(`
      SELECT 
        category,
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions
      WHERE type = 'expense' AND date LIKE ?
      GROUP BY category
      ORDER BY total DESC
    `).all(`${currentMonth}%`);

    // Gắn % cho từng danh mục
    const formattedCategories = categoryBreakdown.map((item) => ({
      category: item.category,
      total: item.total,
      count: item.count,
      percentage: totals.totalExpense > 0 ? Math.round((item.total / totals.totalExpense) * 100) : 0,
    }));

    // Lấy thông tin hạn mức ngân sách tháng
    const budgetInfo = db.prepare("SELECT * FROM budgets WHERE month = ?").get(currentMonth);
    const budgetLimit = budgetInfo ? budgetInfo.limit_amount : 0;
    const spentPercent = budgetLimit > 0 ? Math.round((totals.totalExpense / budgetLimit) * 100) : 0;

    res.json({
      success: true,
      data: {
        month: currentMonth,
        totalIncome: totals.totalIncome,
        totalExpense: totals.totalExpense,
        balance,
        budgetLimit,
        spentPercent,
        categories: formattedCategories,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Quản lý ngân sách tháng (Budget)
router.get("/budget", (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const budget = db.prepare("SELECT * FROM budgets WHERE month = ?").get(month);

    res.json({
      success: true,
      data: budget || { month, limit_amount: 0 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/budget", (req, res) => {
  try {
    const { month, limit_amount } = req.body;
    const currentMonth = month || new Date().toISOString().slice(0, 7);
    const amount = Number(limit_amount);

    if (isNaN(amount) || amount < 0) {
      return res.status(400).json({ success: false, message: "Hạn mức ngân sách không hợp lệ" });
    }

    db.prepare(`
      INSERT INTO budgets (month, limit_amount)
      VALUES (?, ?)
      ON CONFLICT(month) DO UPDATE SET limit_amount = excluded.limit_amount
    `).run(currentMonth, amount);

    res.json({
      success: true,
      message: "Cập nhật ngân sách thành công!",
      data: { month: currentMonth, limit_amount: amount },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
