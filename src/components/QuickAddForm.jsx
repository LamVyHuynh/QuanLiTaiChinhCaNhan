import { useState } from "react";
import { Plus, Minus, X, Tag, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants/categories";
import { parseSmartAmount, numberToVietnameseWords, formatRawVND } from "../utils/format";

export default function QuickAddForm({
  onAddTransaction,
  allCategories = [],
  onOpenCategoryManager,
}) {
  const [isOpen, setIsOpen] = useState(false);
  // Khoản chi luôn là mặc định
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Trà sữa / Cà phê");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dynamicExpenseCategories = allCategories
    .filter((c) => c.type === "expense")
    .map((c) => ({ label: c.name || c.label, emoji: c.emoji || "📌", color: c.color }));
  const dynamicIncomeCategories = allCategories
    .filter((c) => c.type === "income")
    .map((c) => ({ label: c.name || c.label, emoji: c.emoji || "✨", color: c.color }));

  const categories =
    type === "expense"
      ? dynamicExpenseCategories.length > 0
        ? dynamicExpenseCategories
        : EXPENSE_CATEGORIES
      : dynamicIncomeCategories.length > 0
      ? dynamicIncomeCategories
      : INCOME_CATEGORIES;

  // Tính toán số tiền quy đổi theo thời gian thực
  const parsedAmount = parseSmartAmount(amount);
  const amountWords = numberToVietnameseWords(parsedAmount);

  const handleTypeChange = (newType) => {
    setType(newType);
    const targetCategories =
      newType === "expense"
        ? dynamicExpenseCategories.length > 0
          ? dynamicExpenseCategories
          : EXPENSE_CATEGORIES
        : dynamicIncomeCategories.length > 0
        ? dynamicIncomeCategories
        : INCOME_CATEGORIES;
    setCategory(targetCategories[0]?.label || (newType === "expense" ? "Trà sữa / Cà phê" : "Lương"));
  };

  const handleOpenForm = (targetType) => {
    if (isOpen && type === targetType) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      handleTypeChange(targetType);
    }
  };

  // Nút bấm nhanh thêm hậu tố k, tr, ty, 000 để người dùng điện thoại không phải đổi bàn phím
  const handleQuickSuffix = (suffix) => {
    if (!amount) {
      if (suffix === "k") setAmount("20k");
      else if (suffix === "tr") setAmount("1tr");
      else if (suffix === "ty") setAmount("1ty");
      else if (suffix === "000") setAmount("10000");
      return;
    }
    const trimmed = amount.trim();
    if (suffix === "000") {
      const onlyDigits = trimmed.replace(/\D/g, "");
      setAmount(onlyDigits ? `${onlyDigits}000` : "1000");
    } else {
      const base = trimmed.replace(/[a-zA-Zà-ỹÀ-Ỹ\s]+$/, "");
      setAmount(`${base || "1"}${suffix}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Bạn hãy nhập tên khoản tiền nhé (Ví dụ: Ăn trưa, Đổ xăng...)");
      return;
    }
    const numAmount = parseSmartAmount(amount);
    if (!numAmount || numAmount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ (Ví dụ: 19k, 1tr5, 3tr450k, 1ty, hoặc 50000)");
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
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm mb-5 overflow-hidden transition-all">
      {/* Tách riêng 2 mục Thêm: Chi riêng và Thu riêng (Chi luôn để lên đầu/bên trái) */}
      <div className="p-3 bg-white">
        <div className="grid grid-cols-2 gap-2.5">
          {/* Nút Thêm Khoản Chi (Luôn ở đầu tiên) */}
          <button
            type="button"
            onClick={() => handleOpenForm("expense")}
            className={`p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs sm:text-sm transition-all border ${
              isOpen && type === "expense"
                ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                : "bg-rose-50/80 border-rose-200 text-rose-700 hover:bg-rose-100"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                isOpen && type === "expense" ? "bg-white/20 text-white" : "bg-rose-500 text-white"
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
            </div>
            <span>Thêm Khoản Chi</span>
          </button>

          {/* Nút Thêm Khoản Thu */}
          <button
            type="button"
            onClick={() => handleOpenForm("income")}
            className={`p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs sm:text-sm transition-all border ${
              isOpen && type === "income"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-emerald-50/80 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                isOpen && type === "income" ? "bg-white/20 text-white" : "bg-emerald-500 text-white"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span>Thêm Khoản Thu</span>
          </button>
        </div>
      </div>

      {/* Form nhập liệu khi mở */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="p-4 pt-2 space-y-3.5 border-t border-slate-100 bg-slate-50/50">
          {/* Tiêu đề form & nút đóng */}
          <div className="flex items-center justify-between pb-1">
            <span
              className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                type === "expense" ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {type === "expense" ? "💸 Ghi Khoản Chi Mới" : "💵 Ghi Khoản Thu Mới"}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Đóng</span>
            </button>
          </div>

          {/* Nhập Tên & Số tiền */}
          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Tên khoản tiền:
              </label>
              <input
                type="text"
                placeholder={type === "expense" ? "Ví dụ: Ăn trưa, Đổ xăng, Mua áo..." : "Ví dụ: Tiền lương, Làm thêm, Thưởng..."}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 text-slate-900 transition-colors shadow-xs"
              />
            </div>

            {/* Ô nhập số tiền thông minh (Nhận diện cả số và chữ k, tr, ty...) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-600">
                  Số tiền (Nhập chữ & số: 19k, 1tr5, 3tr450k, 1ty):
                </label>
                {amount && (
                  <button
                    type="button"
                    onClick={() => setAmount("")}
                    className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Xóa nhập lại
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Gõ ví dụ: 19k, 1tr5, 3tr450k, 1ty hoặc 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-bold outline-none focus:border-indigo-500 text-slate-900 transition-colors shadow-xs placeholder:text-slate-300 placeholder:font-normal"
                />
                {parsedAmount > 0 && (
                  <div className="absolute right-3 top-2.5 text-emerald-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Hàng nút bấm nhanh hậu tố k, tr, ty, 000 giải quyết tiện lợi trên bàn phím điện thoại */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                <span className="text-[11px] text-slate-400 shrink-0 font-medium mr-0.5">
                  Bấm nhanh:
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickSuffix("k")}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold border border-indigo-100 transition-colors shrink-0"
                  title="Thêm đơn vị nghìn (k)"
                >
                  +k (nghìn)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSuffix("tr")}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold border border-purple-100 transition-colors shrink-0"
                  title="Thêm đơn vị triệu (tr)"
                >
                  +tr (triệu)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSuffix("ty")}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-extrabold border border-amber-100 transition-colors shrink-0"
                  title="Thêm đơn vị tỷ (ty)"
                >
                  +ty (tỷ)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSuffix("000")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition-colors shrink-0 font-mono"
                  title="Thêm 3 số 0"
                >
                  +000
                </button>
              </div>

              {/* Hộp xem trước số tiền quy đổi thời gian thực - Chống nhầm số 0 tuyệt đối */}
              {parsedAmount > 0 && (
                <div
                  className={`mt-2 p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    type === "expense"
                      ? "bg-rose-50/90 border-rose-200 text-rose-900"
                      : "bg-emerald-50/90 border-emerald-200 text-emerald-900"
                  }`}
                >
                  <div>
                    <span className="text-[10px] block font-bold uppercase tracking-wider opacity-70">
                      Hệ thống hiểu là:
                    </span>
                    <span className="font-black text-sm sm:text-base">
                      {formatRawVND(parsedAmount)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-white font-bold text-[11px] border border-black/5 shadow-2xs">
                      {amountWords}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chọn Danh mục */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span>Chọn danh mục phù hợp:</span>
              </label>
              {onOpenCategoryManager && (
                <button
                  type="button"
                  onClick={onOpenCategoryManager}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-indigo-50 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tùy chỉnh danh mục</span>
                </button>
              )}
            </div>
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
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
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
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-xs">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent outline-none w-full text-slate-700 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-xs">
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
            <span>
              {isSubmitting
                ? "Đang lưu..."
                : `Xong - Lưu Khoản ${type === "expense" ? "Chi" : "Thu"} (${
                    parsedAmount > 0 ? formatRawVND(parsedAmount) : ""
                  })`}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
