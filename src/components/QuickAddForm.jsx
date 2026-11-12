import { useState } from "react";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
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
      alert("Vui lòng nhập tên giao dịch");
      return;
    }
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ (> 0 đ)");
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

      setTitle("");
      setAmount("");
      setNote("");
      setIsOpen(false); // Đóng lại sau khi thêm thành công để giữ màn hình gọn gàng
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs mb-5 overflow-hidden transition-all">
      {/* Nút bấm tinh gọn mở form */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-800 block">Thêm thu / chi mới</span>
            <span className="text-xs text-slate-400">Ghi lại giao dịch nhanh chóng</span>
          </div>
        </div>
        <div className="text-slate-400 p-1">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Form nhập liệu tinh gọn khi mở ra */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="p-4 pt-0 space-y-3 border-t border-slate-100">
          {/* Tab chọn Chi / Thu */}
          <div className="grid grid-cols-2 gap-2 pt-3">
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                type === "expense"
                  ? "bg-rose-50 text-rose-600 border border-rose-200"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Khoản Chi</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                type === "income"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Khoản Thu</span>
            </button>
          </div>

          {/* Ô nhập tên & Số tiền */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Tên giao dịch (Ăn trưa, Tiền xăng...)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white text-slate-800"
            />

            <div className="relative">
              <input
                type="number"
                placeholder="Số tiền (đ)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white text-slate-900"
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-medium text-slate-400">
                VNĐ
              </span>
            </div>
          </div>

          {/* Danh mục hiển thị dạng chip cuộn ngang nhỏ gọn */}
          <div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((c) => {
                const isSelected = category === c.label;
                return (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setCategory(c.label)}
                    className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <span className="mr-1">{c.emoji}</span>
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ngày & Ghi chú ngắn */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 outline-none"
            />
            <input
              type="text"
              placeholder="Ghi chú (tuỳ chọn)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 outline-none"
            />
          </div>

          {/* Nút lưu */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
              type === "expense"
                ? "bg-rose-500 hover:bg-rose-600"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {isSubmitting ? "Đang lưu..." : `Lưu khoản ${type === "expense" ? "chi" : "thu"}`}
          </button>
        </form>
      )}
    </div>
  );
}
