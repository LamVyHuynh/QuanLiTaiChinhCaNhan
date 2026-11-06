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
  const [activeTab, setActiveTab] = useState("transactions"); // "transactions" | "analytics" | "budget"
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    budgetLimit: 0,
    spentPercent: 0,
    categories: [],
  });
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
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
    if (window.confirm("Bạn có chắc chắn muốn xóa giao dịch này không?")) {
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
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans p-3.5 sm:p-6 md:py-8 pb-24 sm:pb-10 antialiased">
      {/* Khung giao diện chuẩn Mobile-first, hiển thị thanh lịch ở giữa màn hình */}
      <div className="max-w-lg mx-auto">
        <Header isOnline={isOnline} />

        <OverviewCards
          balance={stats.balance}
          totalIncome={stats.totalIncome}
          totalExpense={stats.totalExpense}
        />

        {/* Thanh chuyển đổi Tab trên Desktop & Tablet */}
        <div className="hidden sm:flex bg-slate-200/70 p-1.5 rounded-2xl mb-6">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "transactions"
                ? "bg-white text-slate-900 shadow-sm shadow-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ReceiptText className="w-4 h-4 text-indigo-600" />
            <span>Sổ Thu Chi</span>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "analytics"
                ? "bg-white text-slate-900 shadow-sm shadow-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <PieChart className="w-4 h-4 text-purple-600" />
            <span>Biểu Đồ Chi Tiêu</span>
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "budget"
                ? "bg-white text-slate-900 shadow-sm shadow-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Target className="w-4 h-4 text-rose-500" />
            <span>Hạn Mức Ngân Sách</span>
          </button>
        </div>

        {/* Nội dung Tab */}
        {activeTab === "transactions" && (
          <>
            <QuickAddForm onAddTransaction={handleAddTransaction} />
            <FilterBar filters={filters} setFilters={setFilters} />
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              isLoading={isLoading}
            />
          </>
        )}

        {activeTab === "analytics" && (
          <AnalyticsChart
            categories={stats.categories || []}
            totalExpense={stats.totalExpense}
          />
        )}

        {activeTab === "budget" && (
          <BudgetTracker
            budgetLimit={stats.budgetLimit}
            totalExpense={stats.totalExpense}
            onUpdateBudget={handleUpdateBudget}
          />
        )}

        <footer className="mt-8 text-center text-xs text-slate-400 pb-2">
          <p>Ví Tài Chính Gen Z • Bản thử nghiệm nội bộ</p>
          <p className="mt-1 text-[11px] text-slate-400/80">
            {isOnline ? "🟢 Kết nối máy chủ Node.js sẵn sàng" : "🟡 Chế độ lưu trữ thiết bị"}
          </p>
        </footer>
      </div>

      {/* Thanh điều hướng đáy màn hình trên Mobile */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
