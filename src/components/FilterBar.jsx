import { Search, X } from "lucide-react";

export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="mb-4 space-y-2.5">
      {/* Ô tìm kiếm to rõ */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Tìm tên khoản tiền (ăn trưa, tiền xăng...)"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-8 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400 shadow-xs"
        />
        {filters.search && (
          <button
            onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
            title="Xóa tìm kiếm"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bộ lọc loại Thu/Chi và Thời gian dạng nút bấm rõ ràng */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
        <div className="flex items-center gap-1.5">
          {[
            { id: "all", label: "Tất cả" },
            { id: "expense", label: "💸 Chỉ Chi" },
            { id: "income", label: "💵 Chỉ Thu" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, type: item.id }))}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filters.type === item.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mốc thời gian */}
        <select
          value={filters.period}
          onChange={(e) => setFilters((prev) => ({ ...prev, period: e.target.value }))}
          className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none shadow-xs"
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
