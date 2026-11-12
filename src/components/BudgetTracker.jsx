import { useState } from "react";
import { Edit3, Check, X, Target } from "lucide-react";

export default function BudgetTracker({ budgetLimit = 0, totalExpense = 0, onUpdateBudget }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newLimit, setNewLimit] = useState(budgetLimit ? String(budgetLimit) : "4500000");

  const formatMoney = (num) => {
    return Number(num).toLocaleString("vi-VN") + " đ";
  };

  const limit = Number(budgetLimit) || 0;
  const spent = Number(totalExpense) || 0;
  const spentPercent = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
  const actualPercent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
  const remaining = limit - spent;

  const handleSave = async (e) => {
    e.preventDefault();
    const val = Number(newLimit);
    if (isNaN(val) || val <= 0) {
      alert("Hạn mức ngân sách phải lớn hơn 0 đ");
      return;
    }
    await onUpdateBudget(val);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-800">Hạn mức ngân sách tháng</h3>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setNewLimit(String(budgetLimit || 4500000));
              setIsEditing(true);
            }}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Sửa</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="flex items-center gap-2 mt-2">
          <input
            type="number"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:border-indigo-500"
            placeholder="Nhập hạn mức..."
            autoFocus
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-indigo-600 text-white"
            title="Lưu"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="p-2 rounded-xl bg-slate-100 text-slate-600"
            title="Hủy"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between text-xs">
            <div>
              <span className="text-slate-400">Đã chi: </span>
              <span className="font-bold text-slate-900">{formatMoney(spent)}</span>
              <span className="text-slate-400"> / {formatMoney(limit)}</span>
            </div>
            <div className="font-bold">
              {remaining >= 0 ? (
                <span className="text-emerald-600">Còn {formatMoney(remaining)}</span>
              ) : (
                <span className="text-rose-600">Vượt {formatMoney(Math.abs(remaining))}</span>
              )}
            </div>
          </div>

          {/* Thanh tiến độ tối giản */}
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
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

          <p className="text-[11px] text-slate-400">
            {actualPercent >= 100
              ? "⚠️ Bạn đã vượt ngân sách tháng này."
              : actualPercent >= 75
              ? "⚡ Đã sử dụng hơn 75% ngân sách."
              : "✅ Ngân sách đang ở mức an toàn."}
          </p>
        </div>
      )}
    </div>
  );
}
