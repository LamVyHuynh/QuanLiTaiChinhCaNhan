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
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-bold text-slate-800">Cơ cấu chi tiêu</h3>
        </div>
        <span className="text-xs font-bold text-slate-500">
          Tổng: {formatMoney(totalExpense)}
        </span>
      </div>

      {categories.length === 0 ? (
        <div className="py-6 text-center text-slate-400 text-xs">
          Chưa có giao dịch chi tiêu để thống kê.
        </div>
      ) : (
        <div className="space-y-3">
          {/* Thanh phân bổ đa sắc tinh gọn */}
          <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex">
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

          {/* Danh sách danh mục */}
          <div className="space-y-2 pt-1 text-xs">
            {categories.map((item, index) => {
              const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
              return (
                <div key={item.category} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${color.bg}`} />
                    <span className="font-medium text-slate-700">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{formatMoney(item.total)}</span>
                    <span className="text-slate-400 text-[11px] font-medium w-8 text-right">
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
