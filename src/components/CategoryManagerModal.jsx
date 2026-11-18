import { useState } from "react";
import { X, Plus, Pencil, Trash2, Check, RotateCcw, Tag } from "lucide-react";
import { POPULAR_EMOJIS } from "../constants/categories";

export default function CategoryManagerModal({
  isOpen,
  onClose,
  categories = [],
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) {
  const [activeType, setActiveType] = useState("expense"); // "expense" | "income"
  const [name, setName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🐶");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Lọc danh mục theo loại (Chi luôn lên đầu)
  const filteredList = categories.filter((c) => c.type === activeType);

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name || cat.label);
    setSelectedEmoji(cat.emoji || "📌");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setSelectedEmoji(activeType === "expense" ? "🐶" : "📈");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập tên danh mục nhé!");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // Cập nhật
        await onUpdateCategory(editingId, {
          name: name.trim(),
          emoji: selectedEmoji,
        });
        handleCancelEdit();
      } else {
        // Thêm mới
        await onAddCategory({
          name: name.trim(),
          type: activeType,
          emoji: selectedEmoji,
          color: activeType === "expense" ? "from-rose-400 to-amber-500" : "from-emerald-400 to-teal-500",
        });
        setName("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (
      window.confirm(
        `Bạn có chắc muốn xóa danh mục "${catName}"?\n(Các giao dịch cũ thuộc danh mục này sẽ tự động chuyển về mục "Khác" để không bị mất tiền)`
      )
    ) {
      await onDeleteCategory(id);
      if (editingId === id) handleCancelEdit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Tùy Chỉnh Danh Mục
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Thêm, sửa icon emoji và tên danh mục theo ý thích
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 tab: Khoản Chi (đầu tiên) & Khoản Thu */}
        <div className="px-4 pt-3 sm:px-5">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveType("expense");
                handleCancelEdit();
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeType === "expense"
                  ? "bg-white text-rose-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>💸 Danh Mục Chi</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveType("income");
                handleCancelEdit();
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeType === "income"
                  ? "bg-white text-emerald-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>💵 Danh Mục Thu</span>
            </button>
          </div>
        </div>

        {/* Body cuộn được */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Form Thêm / Chỉnh sửa */}
          <form
            onSubmit={handleSubmit}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {editingId ? "✏️ Chỉnh Sửa Danh Mục" : "➕ Thêm Danh Mục Mới"}
              </span>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Hủy</span>
                </button>
              )}
            </div>

            {/* Nhập tên & Icon Emoji */}
            <div className="flex items-center gap-2">
              <div
                className="w-11 h-11 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs"
                title="Emoji đang chọn"
              >
                {selectedEmoji}
              </div>
              <input
                type="text"
                placeholder={
                  activeType === "expense"
                    ? "Tên danh mục (ví dụ: Thú cưng, Tiền xăng...)"
                    : "Tên nguồn thu (ví dụ: Chứng khoán, Bán hàng...)"
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 shadow-xs"
              />
            </div>

            {/* Chọn nhanh Emoji phổ biến */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Chọn icon biểu tượng nhanh:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {POPULAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-base transition-all border ${
                      selectedEmoji === emoji
                        ? "bg-indigo-50 border-indigo-400 scale-110 shadow-2xs"
                        : "bg-white border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Nút hành động */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs transition-all flex items-center justify-center gap-1.5 ${
                activeType === "expense"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {editingId ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? "Đang thêm..." : `Thêm Vào Danh Mục ${activeType === "expense" ? "Chi" : "Thu"}`}</span>
                </>
              )}
            </button>
          </form>

          {/* Danh sách danh mục hiện có */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600">
                Danh sách hiện có ({filteredList.length})
              </span>
              <span className="text-[11px] text-slate-400">
                Bấm nút ✏️ để sửa, 🗑️ để xóa
              </span>
            </div>

            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {filteredList.map((cat) => {
                const catName = cat.name || cat.label;
                const isSelected = editingId === cat.id;
                return (
                  <div
                    key={cat.id || catName}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-indigo-50/60 border-indigo-300 shadow-xs"
                        : "bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg shrink-0">{cat.emoji || "📌"}</span>
                      <span className="text-xs font-bold text-slate-800">
                        {catName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors"
                        title="Chỉnh sửa danh mục"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, catName)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                        title="Xóa danh mục"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
