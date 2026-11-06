import { Trash2, Calendar, Coffee, Utensils, ShoppingBag, Home, Bike, BookOpen, Gamepad2, MoreHorizontal, Briefcase, Gift, Heart, Sparkles } from "lucide-react";

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

const getCategoryBg = (type) => {
  return type === "income" ? "bg-emerald-50 border-emerald-100" : "bg-slate-100 border-slate-200/60";
};

export default function TransactionList({ transactions, onDeleteTransaction, isLoading }) {
  const formatMoney = (num) => {
    return Number(num).toLocaleString("vi-VN") + " đ";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span>Lịch sử chi tiêu</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
            {transactions.length}
          </span>
        </h3>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-slate-400 text-sm">
          <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-10 text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl">
            ✨
          </div>
          <p className="text-slate-600 font-bold text-sm">Chưa có giao dịch nào</p>
          <p className="text-slate-400 text-xs mt-1">
            Ghi chép một khoản thu hoặc chi để bắt đầu theo dõi nhé!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {transactions.map((tx) => {
            const isIncome = tx.type === "income";
            return (
              <div
                key={tx.id}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 transition-all"
              >
                {/* Thông tin bên trái */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${getCategoryBg(
                      tx.type
                    )}`}
                  >
                    {getCategoryIcon(tx.category, tx.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{tx.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-medium text-slate-500 bg-white border border-slate-200/80 px-2 py-0.5 rounded-md">
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

                {/* Thông tin bên phải: Tiền & Xóa */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`font-black text-sm block ${
                        isIncome ? "text-emerald-600" : "text-slate-800"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatMoney(tx.amount)}
                    </span>
                    {tx.note && (
                      <span className="text-[11px] text-slate-400 block max-w-[120px] truncate" title={tx.note}>
                        {tx.note}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Xóa giao dịch"
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
