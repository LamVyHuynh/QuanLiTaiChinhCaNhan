import { PieChart } from "lucide-react";
import { formatMoney } from "../utils/format";

const COLOR_PALETTE = [
  { bg: "bg-rose-500", text: "text-rose-600" },
  { bg: "bg-amber-500", text: "text-amber-600" },
  { bg: "bg-indigo-500", text: "text-indigo-600" },
  { bg: "bg-emerald-500", text: "text-emerald-600" },
  { bg: "bg-purple-500", text: "text-purple-600" },
  { bg: "bg-cyan-500", text: "text-cyan-600" },
  { bg: "bg-slate-500", text: "text-slate-600" },
];

export default function AnalyticsChart({ categories = [], totalExpense = 0 }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm mb-5">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">Phân Tích Chi Tiêu</h3>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-400 block font-medium">Tổng tiền đã chi</span>
          <span className="text-sm font-black text-rose-600">{formatMoney(totalExpense)}</span>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          Chưa có giao dịch chi tiêu nào để phân tích thống kê.
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* Thanh phân bổ đa sắc trực quan */}
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
            {categories.map((item, index) => {
              const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
              return (
                <div
                  key={item.category}
                  className={`${color.bg}`}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.category}: ${item.percentage}%`}
                />
              );
            })}
          </div>

          {/* Danh sách từng danh mục */}
          <div className="space-y-2 pt-1 text-xs">
            {categories.map((item, index) => {
              const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
              return (
                <div
                  key={item.category}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-md ${color.bg}`} />
                    <span className="font-bold text-slate-800">{item.category}</span>
                    <span className="text-slate-400 text-[11px]">({item.count} lần)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">
                      {formatMoney(item.total)}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 min-w-[42px] text-center">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
