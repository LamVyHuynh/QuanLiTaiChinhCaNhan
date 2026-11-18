import { Search, X } from "lucide-react";

export default function FilterBar({ filters, setFilters, categories = [] }) {
  // Lọc danh sách danh mục theo loại tiền đang chọn
  const availableCategories = categories.filter(
    (c) => filters.type === "all" || c.type === filters.type
  );

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

      {/* Bộ lọc loại Thu/Chi và Thời gian dạng nút bấm rõ ràng (Khoản Chi luôn ở đầu) */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { id: "expense", label: "💸 Khoản Chi", activeClass: "bg-rose-600 text-white shadow-xs" },
            { id: "income", label: "💵 Khoản Thu", activeClass: "bg-emerald-600 text-white shadow-xs" },
            { id: "all", label: "Tất cả", activeClass: "bg-slate-900 text-white shadow-xs" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  type: item.id,
                  category: "Tất cả", // Reset danh mục khi đổi loại để tránh xung đột
                }))
              }
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filters.type === item.id
                  ? item.activeClass
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Lọc danh mục & Mốc thời gian */}
        <div className="flex items-center gap-1.5 shrink-0">
          {availableCategories.length > 0 && (
            <select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none shadow-xs max-w-[120px] truncate"
            >
              <option value="Tất cả">Tất cả danh mục</option>
              {availableCategories.map((c) => {
                const catName = c.name || c.label;
                return (
                  <option key={c.id || catName} value={catName}>
                    {c.emoji ? `${c.emoji} ` : ""}{catName}
                  </option>
                );
              })}
            </select>
          )}

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
    </div>
  );
}
