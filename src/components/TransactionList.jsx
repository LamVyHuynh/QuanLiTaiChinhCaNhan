import { Trash2, Calendar, Coffee, Utensils, ShoppingBag, Home, Bike, BookOpen, Gamepad2, MoreHorizontal, Briefcase, Gift, Heart, Sparkles } from "lucide-react";
import { formatMoney } from "../utils/format";

// Mapping icon theo danh mục
const getCategoryIcon = (category, type) => {
  switch (category) {
    case "Trà sữa / Cà phê":
      return <Coffee className="w-4 h-4 text-amber-600" />;
    case "Ăn uống":
      return <Utensils className="w-4 h-4 text-orange-600" />;
    case "Mua sắm":
      return <ShoppingBag className="w-4 h-4 text-pink-600" />;
    case "Tiền trọ / Nhà":
      return <Home className="w-4 h-4 text-indigo-600" />;
    case "Đi lại":
      return <Bike className="w-4 h-4 text-emerald-600" />;
    case "Học tập":
      return <BookOpen className="w-4 h-4 text-violet-600" />;
    case "Giải trí":
      return <Gamepad2 className="w-4 h-4 text-cyan-600" />;
    case "Lương":
    case "Làm thêm":
      return <Briefcase className="w-4 h-4 text-emerald-600" />;
    case "Thưởng":
      return <Gift className="w-4 h-4 text-amber-600" />;
    case "Gia đình hỗ trợ":
      return <Heart className="w-4 h-4 text-rose-500" />;
    default:
      return type === "income" ? <Sparkles className="w-4 h-4 text-emerald-600" /> : <MoreHorizontal className="w-4 h-4 text-slate-600" />;
  }
};

export default function TransactionList({ transactions, onDeleteTransaction, isLoading }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/90 mb-5">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <span>Danh Sách Thu Chi</span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {transactions.length} khoản
          </span>
        </h3>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          <div className="inline-block w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          <p className="font-semibold text-slate-600 text-sm mb-1">Chưa có giao dịch nào</p>
          <p>Bấm nút "Ghi Chép Thu / Chi Mới" ở trên để bắt đầu nhé!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const isIncome = tx.type === "income";
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100 border border-slate-200/60 transition-colors"
              >
                {/* Bên trái: Icon, tên, danh mục */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome ? "bg-emerald-100" : "bg-slate-200/80"
                    }`}
                  >
                    {getCategoryIcon(tx.category, tx.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{tx.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-medium text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                        {tx.category}
                      </span>
                      {tx.date && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(tx.date)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bên phải: Số tiền to rõ và nút xóa */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-base font-black block tracking-tight ${
                        isIncome ? "text-emerald-700" : "text-rose-600"
                      }`}
                    >
                      {isIncome ? `+${formatMoney(tx.amount)}` : `-${formatMoney(tx.amount)}`}
                    </span>
                    {tx.note && (
                      <span className="text-[11px] text-slate-400 block max-w-[100px] truncate" title={tx.note}>
                        {tx.note}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Xóa khoản này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
