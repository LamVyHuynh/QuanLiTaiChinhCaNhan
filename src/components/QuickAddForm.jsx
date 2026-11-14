import { useState } from "react";
import { Plus, Minus, ChevronDown, ChevronUp, Tag, Calendar, FileText } from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants/categories";

export default function QuickAddForm({ onAddTransaction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Trà sữa / Cà phê");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === "expense" ? "Trà sữa / Cà phê" : "Lương");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Bạn hãy nhập tên khoản tiền nhé (Ví dụ: Ăn trưa, Đổ xăng...)");
      return;
    }
    const rawAmount = Number(amount);
    if (!rawAmount || rawAmount <= 0) {
      alert("Vui lòng nhập số tiền lớn hơn 0");
      return;
    }

    // Tự động hiểu số tiền: gõ 19 là 19k (19.000đ), gõ 19000 cũng là 19.000đ
    const numAmount = rawAmount < 1000 ? rawAmount * 1000 : rawAmount;

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

      setTitle("");
      setAmount("");
      setNote("");
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm mb-5 overflow-hidden transition-all">
      {/* Nút bấm mở/đóng form to, rõ, dễ bấm */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-extrabold text-slate-900 block">
              Ghi Chép Thu / Chi Mới
            </span>
            <span className="text-xs text-slate-500">
              {isOpen ? "Bấm để thu gọn form" : "Bấm vào đây để thêm khoản tiền mới"}
            </span>
          </div>
        </div>
        <div className="text-slate-400 p-1 bg-slate-100 rounded-lg">
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-700" /> : <ChevronDown className="w-4 h-4 text-slate-700" />}
        </div>
      </button>

      {/* Form nhập liệu đơn giản, thân thiện */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="p-4 pt-1 space-y-3.5 border-t border-slate-100">
          {/* Chọn Loại: Chi tiền hay Thu tiền */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              1. Bạn muốn ghi loại tiền nào?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange("expense")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  type === "expense"
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Minus className="w-4 h-4" />
                <span>💸 Khoản Chi (Tiêu tiền)</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("income")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  type === "income"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>💵 Khoản Thu (Nhận tiền)</span>
              </button>
            </div>
          </div>

          {/* Nhập Tên & Số tiền */}
          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                2. Tên khoản tiền:
              </label>
              <input
                type="text"
                placeholder={type === "expense" ? "Ví dụ: Ăn trưa, Đổ xăng, Mua áo..." : "Ví dụ: Tiền lương, Làm thêm, Thưởng..."}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white text-slate-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                3. Số tiền (Đơn vị tính: k):
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Ví dụ: gõ 19 là 19k (19.000đ)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-14 py-2.5 text-sm font-bold outline-none focus:border-indigo-500 focus:bg-white text-slate-900 transition-colors"
                />
                <span className="absolute right-3 top-2 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-extrabold text-xs">
                  k
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                💡 Mẹo: Bạn chỉ cần gõ <strong>19</strong> là hệ thống tự hiểu <strong>19k</strong>!
              </p>
            </div>
          </div>

          {/* Chọn Danh mục */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>4. Chọn danh mục phù hợp:</span>
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((c) => {
                const isSelected = category === c.label;
                return (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setCategory(c.label)}
                    className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="mr-1.5 text-sm">{c.emoji}</span>
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ngày & Ghi chú */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent outline-none w-full text-slate-700 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Ghi chú thêm (không bắt buộc)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-transparent outline-none w-full text-slate-700 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Nút bấm lưu */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-sm font-bold text-white transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 ${
              type === "expense"
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
            }`}
          >
            <span>{isSubmitting ? "Đang lưu..." : `Xong - Lưu Khoản ${type === "expense" ? "Chi" : "Thu"}`}</span>
          </button>
        </form>
      )}
    </div>
  );
}
