import { useState } from "react";
import { PlusCircle, Sparkles, Tag, FileText, Calendar } from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants/categories";

export default function QuickAddForm({ onAddTransaction }) {
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Trà sữa / Cà phê");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Xử lý đổi type thì reset category tương ứng
  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === "expense" ? "Trà sữa / Cà phê" : "Lương");
  };

  // Nút thêm nhanh số tiền (+20k, +50k, +100k, +200k, +500k)
  const addQuickAmount = (val) => {
    const current = Number(amount) || 0;
    setAmount(String(current + val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Bạn chưa nhập tên khoản thu/chi nè!");
      return;
    }
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ (> 0 đ) nhé!");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddTransaction({
        title: title.trim(),
        amount: numAmount,
        type,
        category,
        note: note.trim(),
        date,
      });

      // Reset form
      setTitle("");
      setAmount("");
      setNote("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span>Ghi chép nhanh</span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </h3>

        {/* Tab chuyển đổi Thu / Chi */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              type === "expense"
                ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            💸 Khoản Chi
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              type === "income"
                ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            💵 Khoản Thu
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nhập tên giao dịch */}
        <div>
          <input
            type="text"
            placeholder={type === "expense" ? "Ví dụ: Trà sữa Gong Cha, Mua áo thun..." : "Ví dụ: Lương part-time, Tiền tip..."}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Nhập số tiền & Phím tắt cộng tiền nhanh */}
        <div>
          <div className="relative">
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-3 text-base font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-300"
            />
            <span className="absolute right-4 top-3 text-xs font-bold text-slate-400">
              VNĐ
            </span>
          </div>

          {/* Quick buttons */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none">
            {[20000, 50000, 100000, 200000, 500000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => addQuickAmount(val)}
                className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
              >
                +{(val / 1000).toLocaleString()}k
              </button>
            ))}
            {amount && (
              <button
                type="button"
                onClick={() => setAmount("")}
                className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        {/* Chọn Danh mục */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            <span>Chọn danh mục:</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map((c) => {
              const isSelected = category === c.label;
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setCategory(c.label)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-all border text-left ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-sm"
                      : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-base">{c.emoji}</span>
                  <span className="truncate">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ngày & Ghi chú (Gọn gàng) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent outline-none w-full text-slate-700 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs">
            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Ghi chú thêm (tùy chọn)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-transparent outline-none w-full text-slate-700 font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Nút gửi */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            type === "expense"
              ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/25"
              : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isSubmitting ? "Đang lưu..." : `Lưu Khoản ${type === "expense" ? "Chi" : "Thu"}`}</span>
        </button>
      </form>
    </div>
  );
}
