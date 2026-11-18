const API_BASE = "/api";

// Fallback localStorage data ban đầu nếu backend offline
const FALLBACK_KEY = "genz_finance_transactions";
const BUDGET_KEY = "genz_finance_budget";
const CATEGORIES_KEY = "genz_finance_categories";

const defaultCategories = [
  { id: 1, name: "Trà sữa / Cà phê", type: "expense", emoji: "🧋", color: "from-amber-400 to-orange-500" },
  { id: 2, name: "Ăn uống", type: "expense", emoji: "🍜", color: "from-orange-400 to-rose-500" },
  { id: 3, name: "Mua sắm", type: "expense", emoji: "🛍️", color: "from-pink-400 to-rose-500" },
  { id: 4, name: "Tiền trọ / Nhà", type: "expense", emoji: "🏠", color: "from-blue-400 to-indigo-500" },
  { id: 5, name: "Đi lại", type: "expense", emoji: "🛵", color: "from-emerald-400 to-teal-500" },
  { id: 6, name: "Học tập", type: "expense", emoji: "📚", color: "from-violet-400 to-purple-500" },
  { id: 7, name: "Giải trí", type: "expense", emoji: "🎮", color: "from-cyan-400 to-blue-500" },
  { id: 8, name: "Thú cưng", type: "expense", emoji: "🐱", color: "from-amber-400 to-yellow-500" },
  { id: 9, name: "Khác", type: "expense", emoji: "📌", color: "from-slate-400 to-slate-600" },
  { id: 10, name: "Lương", type: "income", emoji: "💼", color: "from-emerald-400 to-green-600" },
  { id: 11, name: "Làm thêm", type: "income", emoji: "⏳", color: "from-teal-400 to-emerald-600" },
  { id: 12, name: "Thưởng", type: "income", emoji: "🎁", color: "from-amber-400 to-yellow-500" },
  { id: 13, name: "Gia đình hỗ trợ", type: "income", emoji: "💖", color: "from-pink-400 to-rose-500" },
  { id: 14, name: "Đầu tư", type: "income", emoji: "📈", color: "from-blue-400 to-cyan-500" },
  { id: 15, name: "Khác", type: "income", emoji: "✨", color: "from-slate-400 to-slate-600" },
];

function getLocalCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    return JSON.parse(raw);
  } catch {
    return defaultCategories;
  }
}

function saveLocalCategories(list) {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Lỗi lưu danh mục vào localStorage:", e);
  }
}

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

    // Phân bổ danh mục Chi
    const expenseCatMap = {};
    const expenseCountMap = {};
    list.filter((t) => t.type === "expense").forEach((t) => {
      expenseCatMap[t.category] = (expenseCatMap[t.category] || 0) + Number(t.amount);
      expenseCountMap[t.category] = (expenseCountMap[t.category] || 0) + 1;
    });
    const expenseCategories = Object.entries(expenseCatMap)
      .map(([category, total]) => ({
        category,
        total,
        count: expenseCountMap[category] || 1,
        percentage: totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    // Phân bổ danh mục Thu
    const incomeCatMap = {};
    const incomeCountMap = {};
    list.filter((t) => t.type === "income").forEach((t) => {
      incomeCatMap[t.category] = (incomeCatMap[t.category] || 0) + Number(t.amount);
      incomeCountMap[t.category] = (incomeCountMap[t.category] || 0) + 1;
    });
    const incomeCategories = Object.entries(incomeCatMap)
      .map(([category, total]) => ({
        category,
        total,
        count: incomeCountMap[category] || 1,
        percentage: totalIncome > 0 ? Math.round((total / totalIncome) * 100) : 0,
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
        categories: expenseCategories,
        expenseCategories,
        incomeCategories,
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

  // Lấy danh sách danh mục
  async getCategories(type) {
    try {
      const url = type ? `${API_BASE}/categories?type=${type}` : `${API_BASE}/categories`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.success) return { data: json.data, isOnline: true };
      }
    } catch {
      // Fallback
    }

    let list = getLocalCategories();
    if (type) {
      list = list.filter((c) => c.type === type);
    }
    return { data: list, isOnline: false };
  },

  // Thêm danh mục mới
  async createCategory(catData) {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catData),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return { data: json.data, isOnline: true };
      }
    } catch {
      // Fallback
    }

    const list = getLocalCategories();
    const newCat = { ...catData, id: Date.now() };
    const updated = [...list, newCat];
    saveLocalCategories(updated);
    return { data: newCat, isOnline: false };
  },

  // Cập nhật danh mục
  async updateCategory(id, catData) {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catData),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return { data: json.data, isOnline: true };
      }
    } catch {
      // Fallback
    }

    const list = getLocalCategories();
    const updated = list.map((c) => (c.id === Number(id) ? { ...c, ...catData } : c));
    saveLocalCategories(updated);
    const updatedItem = updated.find((c) => c.id === Number(id));
    return { data: updatedItem, isOnline: false };
  },

  // Xóa danh mục
  async deleteCategory(id) {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return { isOnline: true };
      }
    } catch {
      // Fallback
    }

    const list = getLocalCategories();
    const updated = list.filter((c) => c.id !== Number(id));
    saveLocalCategories(updated);
    return { isOnline: false };
  },
};
