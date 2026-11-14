/**
 * Hàm định dạng số tiền kết hợp phong cách Gen Z ("củ" và "cành"):
 * - Dưới 1 triệu: Hiển thị đơn vị "k" (Ví dụ: 19.000 -> 19k, 65.000 -> 65k)
 * - Từ 1 triệu trở lên: Chuyển đổi thành "củ" và "cành" (Ví dụ: 3.450.000 -> 3 củ 450 cành, 5.000.000 -> 5 củ)
 *
 * Ý nghĩa tâm lý học tài chính:
 * 1. Giúp người dùng không bị ảo tưởng "mình có quá nhiều số 0" để chi tiêu có chừng mực hơn.
 * 2. Ngôn ngữ vui nhộn, quen thuộc với Gen Z, đọc hiểu ngay trong tích tắc mà không cần căng mắt đếm số 0.
 */
export const formatMoney = (amount) => {
  const num = Number(amount) || 0;
  const isNegative = num < 0;
  const abs = Math.abs(num);

  // 1. Khoản dưới 1 triệu: giữ định dạng "k" gọn gàng
  if (abs < 1000000) {
    const inK = Math.round((abs / 1000) * 10) / 10;
    const formattedK = inK.toLocaleString("vi-VN");
    return `${isNegative ? "-" : ""}${formattedK}k`;
  }

  // 2. Khoản từ 1 triệu trở lên: chuyển sang "củ" và "cành"
  const cu = Math.floor(abs / 1000000);
  const remainingCanh = Math.round((abs % 1000000) / 1000);

  const text = remainingCanh === 0 ? `${cu} củ` : `${cu} củ ${remainingCanh} cành`;
  return `${isNegative ? "-" : ""}${text}`;
};

/**
 * Định dạng số tiền VNĐ truyền thống có dấu chấm phân cách (Ví dụ: 3.450.000 đ)
 * Dùng làm chú thích phụ bên dưới để người dùng vẫn nắm được con số tuyệt đối
 */
export const formatRawVND = (amount) => {
  const num = Number(amount) || 0;
  return `${Number(num).toLocaleString("vi-VN")} đ`;
};
