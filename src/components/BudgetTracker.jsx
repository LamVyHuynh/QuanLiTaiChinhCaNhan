import { useState } from "react";
import { Edit3, Check, X, Target } from "lucide-react";
import { formatMoney } from "../utils/format";

export default function BudgetTracker({ budgetLimit = 0, totalExpense = 0, onUpdateBudget }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newLimit, setNewLimit] = useState(budgetLimit ? String(budgetLimit / 1000) : "4500");

  const limit = Number(budgetLimit) || 0;
  const spent = Number(totalExpense) || 0;
  const spentPercent = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
  const actualPercent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
  const remaining = limit - spent;

  const handleSave = async (e) => {
    e.preventDefault();
    const rawVal = Number(newLimit);
    if (isNaN(rawVal) || rawVal <= 0) {
      alert("Vui lòng nhập hạn mức lớn hơn 0");
      return;
    }
    // Nếu gõ số nhỏ (ví dụ 4500) -> hiểu là 4500k (4.500.000đ)
    const val = rawVal < 10000 ? rawVal * 1000 : rawVal;
    await onUpdateBudget(val);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm mb-5">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Hạn Mức Ngân Sách Tháng</h3>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setNewLimit(String(limit > 0 ? limit / 1000 : 4500));
              setIsEditing(true);
            }}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Đổi hạn mức</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-2 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-700">
            Nhập hạn mức chi tiêu trong tháng (k):
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-3 pr-10 py-2 text-sm font-bold outline-none focus:border-indigo-500"
                placeholder="Ví dụ: 4500 (là 4.500k)"
                autoFocus
              />
              <span className="absolute right-3 top-2 text-xs font-bold text-indigo-600">k</span>
            </div>
            <button
              type="submit"
              className="p-2 rounded-xl bg-indigo-600 text-white font-bold text-xs px-3 shadow-xs"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs px-3"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Gợi ý: Nhập <strong>4500</strong> tương đương hạn mức <strong>4.500k</strong> (4,5 triệu).
          </p>
        </form>
      ) : (
        <div className="space-y-3 pt-1">
          {/* Thông tin số liệu to rõ */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Hạn mức tháng</span>
              <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                {limit > 0 ? formatMoney(limit) : "Chưa đặt"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 font-medium block text-[11px]">
                {remaining >= 0 ? "Còn lại được tiêu" : "Đã vượt quá"}
              </span>
              <span
                className={`font-black text-sm sm:text-base ${
                  remaining >= 0 ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {remaining >= 0 ? formatMoney(remaining) : formatMoney(Math.abs(remaining))}
              </span>
            </div>
          </div>

          {/* Thanh tiến độ */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Tiến độ chi tiêu</span>
              <span className={actualPercent >= 100 ? "text-rose-600 font-bold" : "text-slate-700 font-bold"}>
                Đã tiêu {actualPercent}%
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  actualPercent >= 100
                    ? "bg-rose-500"
                    : actualPercent >= 75
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${spentPercent}%` }}
              />
            </div>
          </div>

          <div
            className={`p-2.5 rounded-xl text-xs font-semibold ${
              actualPercent >= 100
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : actualPercent >= 75
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            {actualPercent >= 100
              ? "⚠️ Bạn đã chi tiêu vượt hạn mức đã đặt cho tháng này!"
              : actualPercent >= 75
              ? "⚡ Bạn đã chi tiêu hơn 75% ngân sách. Hãy cân nhắc các khoản chi sắp tới!"
              : "✅ Chi tiêu đang nằm trong tầm kiểm soát an toàn."}
          </div>
        </div>
      )}
    </div>
  );
}
