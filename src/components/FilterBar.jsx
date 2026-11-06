import { Search, X, RotateCcw } from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants/categories";

export default function FilterBar({ filters, setFilters }) {
  // Lấy toàn bộ danh mục để hiển thị lọc
  const allCategories = [
    "Tất cả",
    ...EXPENSE_CATEGORIES.map((c) => c.label),
    ...INCOME_CATEGORIES.map((c) => c.label),
  ];
  // Khử trùng lặp
  const uniqueCategories = Array.from(new Set(allCategories));

  const hasActiveFilter =
    filters.search ||
    filters.type !== "all" ||
    filters.category !== "Tất cả" ||
    filters.period !== "month";

  const handleReset = () => {
    setFilters({
      search: "",
      type: "all",
      category: "Tất cả",
      period: "month",
    });
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 mb-6 space-y-3.5">
      {/* Thanh tìm kiếm */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Tìm theo tên (ví dụ: trà sữa, tiền điện, xăng...)"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
        />
        {filters.search && (
          <button
            onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Lọc theo thời gian & Loại giao dịch */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
        {/* Bộ lọc mốc thời gian */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "today", label: "Hôm nay" },
            { id: "week", label: "7 ngày" },
            { id: "month", label: "Tháng này" },
            { id: "all", label: "Tất cả" },
          ].map((p) => {
            const isSelected = filters.period === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, period: p.id }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Nút đặt lại bộ lọc */}
        {hasActiveFilter && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại</span>
          </button>
        )}
      </div>

      {/* Lọc theo Loại & Danh mục */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Lọc theo Loại: Tất cả / Chi / Thu */}
        <select
          value={filters.type}
          onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500"
        >
          <option value="all">🔍 Tất cả loại thu chi</option>
          <option value="expense">💸 Chỉ xem Khoản Chi</option>
          <option value="income">💵 Chỉ xem Khoản Thu</option>
        </select>

        {/* Lọc theo Danh mục */}
        <select
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500"
        >
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              🏷️ {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
