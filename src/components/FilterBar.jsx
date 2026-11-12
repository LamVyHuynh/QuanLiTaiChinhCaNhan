import { Search, X } from "lucide-react";

export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="mb-4 space-y-2">
      {/* Ô tìm kiếm tinh gọn */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Tìm kiếm giao dịch..."
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          className="w-full bg-white border border-slate-200/80 rounded-xl pl-9 pr-8 py-2 text-xs outline-none focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400"
        />
        {filters.search && (
          <button
            onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Bộ lọc loại Thu/Chi dạng chip tối giản */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
        <div className="flex items-center gap-1.5">
          {[
            { id: "all", label: "Tất cả" },
            { id: "expense", label: "Chi tiêu" },
            { id: "income", label: "Thu nhập" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, type: item.id }))}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filters.type === item.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mốc thời gian gọn gàng */}
        <select
          value={filters.period}
          onChange={(e) => setFilters((prev) => ({ ...prev, period: e.target.value }))}
          className="bg-white border border-slate-200/70 rounded-lg px-2 py-1.5 text-xs text-slate-600 outline-none"
        >
          <option value="month">Tháng này</option>
          <option value="today">Hôm nay</option>
          <option value="week">7 ngày qua</option>
          <option value="all">Toàn bộ</option>
        </select>
      </div>
    </div>
  );
}
