import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import OverviewCards from "./components/OverviewCards";
import BudgetTracker from "./components/BudgetTracker";
import QuickAddForm from "./components/QuickAddForm";
import FilterBar from "./components/FilterBar";
import TransactionList from "./components/TransactionList";
import AnalyticsChart from "./components/AnalyticsChart";
import MobileBottomNav from "./components/MobileBottomNav";
import { api } from "./services/api";
import { ReceiptText, PieChart, Target } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" (Tổng quan: Thống kê + Thêm) | "history" (Sổ giao dịch) | "budget" (Hạn mức)
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    budgetLimit: 0,
    spentPercent: 0,
    categories: [],
    expenseCategories: [],
    incomeCategories: [],
  });
  const [filters, setFilters] = useState({
    search: "",
    type: "expense", // Mặc định mở Sổ Giao Dịch là hiện Khoản Chi trước
    category: "Tất cả",
    period: "month",
  });
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load danh sách và thống kê
  const refreshData = useCallback(async (currentFilters = filters) => {
    try {
      const [txResult, statsResult] = await Promise.all([
        api.getTransactions(currentFilters),
        api.getStats(),
      ]);

      setTransactions(txResult.data);
      setIsOnline(txResult.isOnline);

      if (statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  }, [filters]);

  // Khởi tạo & Tự động lọc khi filters thay đổi
  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      try {
        const [txResult, statsResult] = await Promise.all([
          api.getTransactions(filters),
          api.getStats(),
        ]);

        if (!isCancelled) {
          setTransactions(txResult.data);
          setIsOnline(txResult.isOnline);
          if (statsResult.data) {
            setStats(statsResult.data);
          }
        }
      } catch (err) {
        console.error("Lỗi khi lọc dữ liệu:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [filters]);

  // Thêm giao dịch mới
  const handleAddTransaction = async (newTx) => {
    await api.createTransaction(newTx);
    await refreshData(filters);
  };

  // Xóa giao dịch
  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa giao dịch này?")) {
      await api.deleteTransaction(id);
      await refreshData(filters);
    }
  };

  // Cập nhật hạn mức ngân sách
  const handleUpdateBudget = async (limitAmount) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    await api.updateBudget(currentMonth, limitAmount);
    await refreshData(filters);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 pb-20 sm:pb-8 antialiased">
      <div className="max-w-md mx-auto">
        <Header isOnline={isOnline} />

        <OverviewCards
          balance={stats.balance}
          totalIncome={stats.totalIncome}
          totalExpense={stats.totalExpense}
        />

        {/* Thanh chuyển tab trên Desktop / Tablet */}
        <div className="hidden sm:flex bg-slate-200/60 p-1 rounded-xl mb-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "overview"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Tổng Quan & Ghi Chép</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "history"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ReceiptText className="w-3.5 h-3.5" />
            <span>Sổ Giao Dịch</span>
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "budget"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Hạn Mức</span>
          </button>
        </div>

        {/* Nội dung theo Tab */}
        {/* Tab 1: Gộp chức năng Thêm Thu Chi & Thống Kê Thu Chi vào 1 tab để tiết kiệm không gian */}
        {activeTab === "overview" && (
          <>
            <QuickAddForm onAddTransaction={handleAddTransaction} />
            <AnalyticsChart
              expenseCategories={stats.expenseCategories || stats.categories || []}
              incomeCategories={stats.incomeCategories || []}
              totalExpense={stats.totalExpense}
              totalIncome={stats.totalIncome}
            />
          </>
        )}

        {/* Tab 2: Sổ giao dịch chi tiết và bộ lọc tìm kiếm */}
        {activeTab === "history" && (
          <>
            <FilterBar filters={filters} setFilters={setFilters} />
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              isLoading={isLoading}
            />
          </>
        )}

        {/* Tab 3: Hạn mức ngân sách */}
        {activeTab === "budget" && (
          <BudgetTracker
            budgetLimit={stats.budgetLimit}
            totalExpense={stats.totalExpense}
            onUpdateBudget={handleUpdateBudget}
          />
        )}
      </div>

      {/* Điều hướng dưới đáy cho Mobile */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
