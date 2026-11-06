const API_BASE = "/api";

// Fallback localStorage data ban đầu nếu backend offline
const FALLBACK_KEY = "genz_finance_transactions";
const BUDGET_KEY = "genz_finance_budget";

const defaultTransactions = [
  {
    id: 1,
    title: "Lương làm thêm / Part-time",
    amount: 5500000,
    type: "income",
    category: "Lương",
    date: new Date().toISOString().split("T")[0],
    note: "Lương tháng này",
  },
  {
    id: 2,
    title: "Trà sữa Koi Thé & Ăn vặt",
    amount: 65000,
    type: "expense",
    category: "Trà sữa / Cà phê",
    date: new Date().toISOString().split("T")[0],
    note: "Uống với bạn thân",
  },
  {
    id: 3,
    title: "Tiền phòng trọ & Điện nước",
    amount: 2200000,
    type: "expense",
    category: "Tiền trọ / Nhà",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    note: "Tiền phòng tháng này",
  },
  {
    id: 4,
    title: "Đổ xăng xe máy",
    amount: 70000,
    type: "expense",
    category: "Đi lại",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    note: "Đầy bình xăng",
  },
  {
    id: 5,
    title: "Săn sale Shopee đồ decor phòng",
    amount: 125000,
    type: "expense",
    category: "Mua sắm",
    date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    note: "Kệ sách mini",
  },
];

function getLocalTransactions() {
  try {
    const raw = localStorage.getItem(FALLBACK_KEY);
    if (!raw) {
      localStorage.setItem(FALLBACK_KEY, JSON.stringify(defaultTransactions));
      return defaultTransactions;
    }
    return JSON.parse(raw);
  } catch {
    return defaultTransactions;
  }
}

function saveLocalTransactions(txs) {
  try {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(txs));
  } catch (err) {
    console.error("Lỗi lưu localStorage:", err);
  }
}

export const api = {
  // Lấy danh sách giao dịch có hỗ trợ bộ lọc và tìm kiếm
  async getTransactions(filters = {}) {
    const today = new Date().toISOString().split("T")[0];
    let computedStartDate = filters.startDate;
    let computedEndDate = filters.endDate;
    let computedMonth = filters.month;

    if (filters.period === "today") {
      computedStartDate = today;
      computedEndDate = today;
    } else if (filters.period === "week") {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
      computedStartDate = weekAgo;
      computedEndDate = today;
    } else if (filters.period === "month") {
      computedMonth = today.slice(0, 7);
    }

    try {
      const params = new URLSearchParams();
      if (filters.type && filters.type !== "all") params.append("type", filters.type);
      if (filters.category && filters.category !== "Tất cả") params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);
      if (computedMonth) params.append("month", computedMonth);
      if (computedStartDate) params.append("startDate", computedStartDate);
      if (computedEndDate) params.append("endDate", computedEndDate);

      const url = `${API_BASE}/transactions${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Backend response error");
      const json = await res.json();
      if (json.success) return { data: json.data, isOnline: true };
    } catch {
      // Fallback về LocalStorage
    }

    // Logic lọc trong localStorage khi offline
    let list = getLocalTransactions();
    if (filters.type && filters.type !== "all") {
      list = list.filter((t) => t.type === filters.type);
    }
    if (filters.category && filters.category !== "Tất cả") {
      list = list.filter((t) => t.category === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || (t.note && t.note.toLowerCase().includes(q)));
    }
    if (computedMonth) {
      list = list.filter((t) => t.date && t.date.startsWith(computedMonth));
    }
    if (computedStartDate) {
      list = list.filter((t) => t.date && t.date >= computedStartDate);
    }
    if (computedEndDate) {
      list = list.filter((t) => t.date && t.date <= computedEndDate);
    }
    return { data: list, isOnline: false };
  },

  // Thêm giao dịch
  async createTransaction(data) {
    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return { data: json.data, isOnline: true };
      }
    } catch {
      // Fallback
    }

    const list = getLocalTransactions();
    const newTx = { ...data, id: Date.now() };
    const updated = [newTx, ...list];
    saveLocalTransactions(updated);
    return { data: newTx, isOnline: false };
  },

  // Xóa giao dịch
  async deleteTransaction(id) {
    try {
      const res = await fetch(`${API_BASE}/transactions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return { success: true, isOnline: true };
      }
    } catch {
      // Fallback
    }

    const list = getLocalTransactions();
    const updated = list.filter((t) => t.id !== id);
    saveLocalTransactions(updated);
    return { success: true, isOnline: false };
  },

  // Lấy thống kê
  async getStats(month) {
    try {
      const currentMonth = month || new Date().toISOString().slice(0, 7);
      const res = await fetch(`${API_BASE}/stats?month=${currentMonth}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) return { data: json.data, isOnline: true };
      }
    } catch {
      // Fallback tính toán offline
    }

    const currentMonth = month || new Date().toISOString().slice(0, 7);
    const list = getLocalTransactions().filter((t) => t.date && t.date.startsWith(currentMonth));
    const totalIncome = list.filter((t) => t.type === "income").reduce((acc, t) => acc + Number(t.amount), 0);
    const totalExpense = list.filter((t) => t.type === "expense").reduce((acc, t) => acc + Number(t.amount), 0);
    const balance = totalIncome - totalExpense;

    // Phân bổ danh mục
    const catMap = {};
    list.filter((t) => t.type === "expense").forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount);
    });
    const categories = Object.entries(catMap)
      .map(([category, total]) => ({
        category,
        total,
        percentage: totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    const savedBudget = Number(localStorage.getItem(BUDGET_KEY)) || 4500000;
    const spentPercent = savedBudget > 0 ? Math.round((totalExpense / savedBudget) * 100) : 0;

    return {
      data: {
        month: currentMonth,
        totalIncome,
        totalExpense,
        balance,
        budgetLimit: savedBudget,
        spentPercent,
        categories,
      },
      isOnline: false,
    };
  },

  // Cập nhật ngân sách
  async updateBudget(month, limit_amount) {
    try {
      const res = await fetch(`${API_BASE}/budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, limit_amount }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return { data: json.data, isOnline: true };
      }
    } catch {
      // Fallback
    }

    localStorage.setItem(BUDGET_KEY, String(limit_amount));
    return { data: { month, limit_amount }, isOnline: false };
  },
};
