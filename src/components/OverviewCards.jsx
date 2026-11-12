import { useState } from "react";
import { Eye, EyeOff, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function OverviewCards({ balance, totalIncome, totalExpense }) {
  const [showBalance, setShowBalance] = useState(true);

  const formatMoney = (num) => {
    return Number(num).toLocaleString("vi-VN") + " đ";
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm border border-slate-800 mb-5">
      <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1.5">
        <span>Số dư khả dụng</span>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-1 hover:text-white transition-colors"
          title={showBalance ? "Ẩn số dư" : "Hiện số dư"}
        >
          {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
        {showBalance ? (
          <span className={balance >= 0 ? "text-white" : "text-rose-400"}>
            {formatMoney(balance)}
          </span>
        ) : (
          <span className="text-slate-400 font-mono tracking-widest text-xl">••••••••</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <ArrowDownLeft className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Thu nhập</span>
            <span className="font-bold text-emerald-400">
              {showBalance ? `+${formatMoney(totalIncome)}` : "••••"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Chi tiêu</span>
            <span className="font-bold text-rose-400">
              {showBalance ? `-${formatMoney(totalExpense)}` : "••••"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
