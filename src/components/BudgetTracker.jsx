import { useState } from "react";
import { ShieldAlert, ShieldCheck, AlertTriangle, Edit3, Check, X, Target } from "lucide-react";

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

  // Trạng thái cảnh báo chi tiêu
  const getBudgetStatus = () => {
    if (limit === 0) {
      return {
        level: "none",
        color: "text-slate-500",
        barColor: "bg-slate-300",
        bgBadge: "bg-slate-100 text-slate-600",
        message: "Chưa đặt ngân sách tháng. Hãy đặt hạn mức để kiểm soát chi tiêu nhé!",
        icon: <Target className="w-4 h-4 text-slate-500" />,
      };
    }
    if (actualPercent >= 100) {
      return {
        level: "danger",
        color: "text-rose-600",
        barColor: "bg-rose-500",
        bgBadge: "bg-rose-50 text-rose-700 border border-rose-200",
        message: `🚨 Báo động đỏ: Bạn đã chi vượt ${actualPercent - 100}% hạn mức! Dừng mua sắm ngay kẻo "cháy túi".`,
        icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
      };
    }
    if (actualPercent >= 75) {
      return {
        level: "warning",
        color: "text-amber-600",
        barColor: "bg-amber-500",
        bgBadge: "bg-amber-50 text-amber-700 border border-amber-200",
        message: `⚠️ Chú ý: Đã tiêu ${actualPercent}% ngân sách rồi! Tiết kiệm lại những ngày cuối tháng nha.`,
        icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      };
    }
    return {
      level: "safe",
      color: "text-emerald-600",
      barColor: "bg-emerald-500",
      bgBadge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      message: `🥑 An toàn: Mới tiêu ${actualPercent}% ngân sách. Bạn đang kiểm soát chi tiêu rất tốt!`,
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    };
  };

  const status = getBudgetStatus();

  const handleSave = async (e) => {
    e.preventDefault();
    const val = Number(newLimit);
    if (isNaN(val) || val <= 0) {
      alert("Hạn mức ngân sách phải lớn hơn 0 đ nhé!");
      return;
    }
    await onUpdateBudget(val);
    setIsEditing(false);
  };

  const quickPresets = [3000000, 4500000, 6000000, 8000000, 10000000];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Hạn mức chi tiêu tháng</h3>
            <p className="text-xs text-slate-400">Kiểm soát dòng tiền không lo hết ví</p>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setNewLimit(String(budgetLimit || 4500000));
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Đổi hạn mức</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-700">
            Đặt hạn mức chi tiêu trong tháng (VNĐ):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-indigo-500 text-slate-900"
              placeholder="Ví dụ: 4500000"
              autoFocus
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
              title="Lưu hạn mức"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700"
              title="Hủy"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nút chọn nhanh */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] text-slate-400 font-semibold shrink-0">Gợi ý:</span>
            {quickPresets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setNewLimit(String(val))}
                className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                {val / 1000000} triệu
              </button>
            ))}
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Thông tin số liệu */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Hạn mức đặt ra</span>
              <span className="text-sm sm:text-base font-black text-slate-800">
                {limit > 0 ? formatMoney(limit) : "Chưa cài đặt"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-medium block">
                {remaining >= 0 ? "Còn lại được tiêu" : "Đã vượt hạn mức"}
              </span>
              <span
                className={`text-sm sm:text-base font-black ${
                  remaining >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {remaining >= 0 ? formatMoney(remaining) : formatMoney(Math.abs(remaining))}
              </span>
            </div>
          </div>

          {/* Thanh tiến độ phần trăm */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">Đã tiêu</span>
              <span className={status.color}>{actualPercent}% hạn mức</span>
            </div>
            <div className="h-3.5 w-full rounded-full bg-slate-100 overflow-hidden shadow-inner">
              <div
                className={`h-full ${status.barColor} rounded-full transition-all duration-700`}
                style={{ width: `${spentPercent}%` }}
              />
            </div>
          </div>

          {/* Hộp thông điệp cảnh báo Gen Z */}
          <div
            className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold ${status.bgBadge}`}
          >
            {status.icon}
            <p className="flex-1 leading-relaxed">{status.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
