import { Wallet, Tag } from "lucide-react";

export default function Header({ isOnline, onOpenCategoryManager }) {
  return (
    <header className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
          <Wallet className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Ví Chi Tiêu
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onOpenCategoryManager && (
          <button
            type="button"
            onClick={onOpenCategoryManager}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 transition-colors shadow-2xs"
            title="Quản lý & tùy chỉnh danh mục thu chi"
          >
            <Tag className="w-3 h-3 text-indigo-600" />
            <span>Danh Mục</span>
          </button>
        )}

        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white border border-slate-200/80 text-slate-600 shadow-xs"
          title={isOnline ? "Kết nối máy chủ Backend" : "Lưu trữ nội bộ thiết bị"}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
          />
          <span>{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>
    </header>
  );
}
