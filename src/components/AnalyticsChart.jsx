import { useState } from "react";
import { PieChart, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { formatMoney } from "../utils/format";

const EXPENSE_PALETTE = [
  { bg: "bg-rose-500", text: "text-rose-600" },
  { bg: "bg-amber-500", text: "text-amber-600" },
  { bg: "bg-indigo-500", text: "text-indigo-600" },
  { bg: "bg-pink-500", text: "text-pink-600" },
  { bg: "bg-purple-500", text: "text-purple-600" },
  { bg: "bg-cyan-500", text: "text-cyan-600" },
  { bg: "bg-slate-500", text: "text-slate-600" },
];

const INCOME_PALETTE = [
  { bg: "bg-emerald-500", text: "text-emerald-600" },
  { bg: "bg-teal-500", text: "text-teal-600" },
  { bg: "bg-sky-500", text: "text-sky-600" },
  { bg: "bg-indigo-500", text: "text-indigo-600" },
  { bg: "bg-amber-500", text: "text-amber-600" },
  { bg: "bg-lime-500", text: "text-lime-600" },
  { bg: "bg-slate-500", text: "text-slate-600" },
];

export default function AnalyticsChart({
  expenseCategories = [],
  incomeCategories = [],
  totalExpense = 0,
  totalIncome = 0,
  categories = [],
}) {
  // Khoản chi luôn ở vị trí đầu tiên và được chọn mặc định
  const [subTab, setSubTab] = useState("expense");

  // Fallback tương thích
  const resolvedExpenseList =
    expenseCategories && expenseCategories.length > 0 ? expenseCategories : categories;
  const resolvedIncomeList = incomeCategories || [];

  const isExpense = subTab === "expense";
  const activeList = isExpense ? resolvedExpenseList : resolvedIncomeList;
  const activeTotal = isExpense ? totalExpense : totalIncome;
  const palette = isExpense ? EXPENSE_PALETTE : INCOME_PALETTE;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm mb-5">
      {/* Tiêu đề & Chọn 2 mục nhỏ: Thống kê Khoản Chi và Thống kê Khoản Thu (Chi luôn lên đầu) */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">Báo Cáo & Phân Tích</h3>
        </div>

        {/* 2 tab nhỏ: Khoản Chi (đầu tiên) và Khoản Thu */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setSubTab("expense")}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isExpense
                ? "bg-white text-rose-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Thống Kê Khoản Chi</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab("income")}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              !isExpense
                ? "bg-white text-emerald-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Thống Kê Khoản Thu</span>
          </button>
        </div>
      </div>

      {/* Thông tin tổng tiền của mục đang chọn */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-slate-500 block">
            {isExpense ? "Tổng tiền các khoản chi:" : "Tổng tiền các khoản thu:"}
          </span>
          <span className="text-[11px] text-slate-400">
            {isExpense ? "Bao gồm tất cả danh mục chi tiêu" : "Bao gồm các nguồn thu trong tháng"}
          </span>
        </div>
        <div className="text-right">
          <span
            className={`text-base font-black ${
              isExpense ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {isExpense ? `-${formatMoney(activeTotal)}` : `+${formatMoney(activeTotal)}`}
          </span>
        </div>
      </div>

      {/* Nội dung danh sách phân bổ */}
      {activeList.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          {isExpense
            ? "Chưa có khoản chi tiêu nào trong tháng này để phân tích."
            : "Chưa có khoản thu nhập nào trong tháng này để phân tích."}
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* Thanh phân bổ đa sắc trực quan */}
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
            {activeList.map((item, index) => {
              const color = palette[index % palette.length];
              return (
                <div
                  key={item.category}
                  className={`${color.bg}`}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.category}: ${item.percentage}% (${formatMoney(item.total)})`}
                />
              );
            })}
          </div>

          {/* Danh sách từng danh mục */}
          <div className="space-y-2 pt-1 text-xs">
            {activeList.map((item, index) => {
              const color = palette[index % palette.length];
              return (
                <div
                  key={item.category}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-md ${color.bg} shrink-0`} />
                    <span className="font-bold text-slate-800">{item.category}</span>
                    <span className="text-slate-400 text-[11px]">({item.count} lần)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">
                      {isExpense ? `-${formatMoney(item.total)}` : `+${formatMoney(item.total)}`}
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
