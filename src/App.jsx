import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import OverviewCards from "./components/OverviewCards";
import QuickAddForm from "./components/QuickAddForm";
import TransactionList from "./components/TransactionList";
import { api } from "./services/api";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    budgetLimit: 0,
    spentPercent: 0,
  });
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load danh sách và thống kê khi thao tác
  const refreshData = useCallback(async () => {
    try {
      const [txResult, statsResult] = await Promise.all([
        api.getTransactions(),
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
  }, []);

  // Khởi tạo ban đầu với cleanup flag chuẩn React 19
  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      try {
        const [txResult, statsResult] = await Promise.all([
          api.getTransactions(),
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
        console.error("Lỗi khi khởi tạo dữ liệu:", err);
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
  }, []);

  // Thêm giao dịch mới
  const handleAddTransaction = async (newTx) => {
    await api.createTransaction(newTx);
    await refreshData();
  };

  // Xóa giao dịch
  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giao dịch này không?")) {
      await api.deleteTransaction(id);
      await refreshData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans p-3.5 sm:p-6 md:py-8 antialiased">
      {/* Khung giao diện chuẩn Mobile-first, hiển thị thanh lịch ở giữa màn hình */}
      <div className="max-w-lg mx-auto">
        <Header isOnline={isOnline} />

        <OverviewCards
          balance={stats.balance}
          totalIncome={stats.totalIncome}
          totalExpense={stats.totalExpense}
        />

        <QuickAddForm onAddTransaction={handleAddTransaction} />

        <TransactionList
          transactions={transactions}
          onDeleteTransaction={handleDeleteTransaction}
          isLoading={isLoading}
        />

        <footer className="mt-8 text-center text-xs text-slate-400 pb-6">
          <p>Ví Tài Chính Gen Z • Bản thử nghiệm nội bộ</p>
          <p className="mt-1 text-[11px] text-slate-400/80">
            {isOnline ? "🟢 Kết nối máy chủ Node.js sẵn sàng" : "🟡 Chế độ lưu trữ thiết bị"}
          </p>
        </footer>
      </div>
    </div>
  );
}
