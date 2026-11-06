import { useState } from "react";
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet } from "lucide-react";

export default function OverviewCards({ balance, totalIncome, totalExpense }) {
  const [showBalance, setShowBalance] = useState(true);

  const formatMoney = (num) => {
    return Number(num).toLocaleString("vi-VN") + " đ";
  };

  return (
    <div className="space-y-3 mb-6">
      {/* THẺ SỐ DƯ CHÍNH (Card phong cách thẻ ngân hàng Gen Z) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 text-white shadow-xl shadow-indigo-950/20 border border-slate-800">
        {/* Họa tiết nền mờ */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-36 h-36 rounded-full bg-pink-500/10 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Wallet className="w-4 h-4 text-indigo-300" />
            </div>
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
              Số Dư Khả Dụng
            </span>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={showBalance ? "Ẩn số tiền" : "Hiện số tiền"}
          >
            {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {showBalance ? (
              <span className={balance >= 0 ? "text-white" : "text-rose-400"}>
                {formatMoney(balance)}
              </span>
            ) : (
              <span className="text-slate-400 font-mono tracking-widest">••••••••••</span>
            )}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Tổng thu</p>
              <p className="text-xs sm:text-sm font-bold text-emerald-400">
                {showBalance ? `+${formatMoney(totalIncome)}` : "••••••"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Tổng chi</p>
              <p className="text-xs sm:text-sm font-bold text-rose-400">
                {showBalance ? `-${formatMoney(totalExpense)}` : "••••••"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
