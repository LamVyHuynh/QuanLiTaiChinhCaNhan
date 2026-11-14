import { useState } from "react";
import { Eye, EyeOff, ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { formatMoney, formatRawVND } from "../utils/format";

export default function OverviewCards({ balance, totalIncome, totalExpense }) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/90 mb-5">
      {/* Tiêu đề & Nút ẩn hiện số dư */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Số Dư Ví Của Bạn
          </span>
        </div>

        <button
          onClick={() => setShowBalance(!showBalance)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
          title={showBalance ? "Bấm để ẩn số dư" : "Bấm để hiện số dư"}
        >
          {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showBalance ? "Ẩn" : "Hiện"}</span>
        </button>
      </div>

      {/* Số dư to rõ theo phong cách Gen Z */}
      <div className="py-2 mb-3">
        {showBalance ? (
          <div>
            <div
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                balance >= 0 ? "text-slate-900" : "text-rose-600"
              }`}
            >
              {formatMoney(balance)}
            </div>
            {Math.abs(balance) >= 1000000 && (
              <span className="text-xs font-semibold text-slate-400 block mt-0.5">
                (tương đương {formatRawVND(balance)})
              </span>
            )}
          </div>
        ) : (
          <div className="text-2xl text-slate-400 font-mono tracking-widest py-1">
            ••••••••
          </div>
        )}
      </div>

      {/* Hai ô Thu Nhập và Chi Tiêu */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
        <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-emerald-700 block">
              Tổng Thu Vào
            </span>
            <span className="text-sm sm:text-base font-black text-emerald-800 block truncate" title={formatRawVND(totalIncome)}>
              {showBalance ? `+${formatMoney(totalIncome)}` : "••••"}
            </span>
          </div>
        </div>

        <div className="bg-rose-50/70 border border-rose-100 p-3 rounded-xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-rose-700 block">
              Tổng Đã Chi
            </span>
            <span className="text-sm sm:text-base font-black text-rose-800 block truncate" title={formatRawVND(totalExpense)}>
              {showBalance ? `-${formatMoney(totalExpense)}` : "••••"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
