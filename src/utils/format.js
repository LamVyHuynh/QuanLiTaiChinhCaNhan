/**
 * Hàm định dạng số tiền tối ưu, siêu ngắn gọn và đồng nhất theo đơn vị "k" và "tr":
 * - Dưới 1 triệu: Hiển thị dạng "k" (Ví dụ: 19.000 -> 19k, 65.000 -> 65k)
 * - Từ 1 triệu trở lên: Hiển thị dạng "tr...k" (Ví dụ: 3.450.000 -> 3tr450k, 5.000.000 -> 5tr, 2.200.000 -> 2tr200k)
 *
 * Ưu điểm:
 * 1. Cực kỳ ngắn gọn, tiết kiệm diện tích tối đa trên màn hình điện thoại.
 * 2. Đồng nhất hoàn toàn với các khoản chi tiêu nhỏ (đều kết thúc bằng "k").
 * 3. Chuẩn thói quen nhắn tin, chuyển khoản và ghi chú hàng ngày của người Việt (Zalo, Banking...).
 */
export const formatMoney = (amount) => {
  const num = Number(amount) || 0;
  const isNegative = num < 0;
  const abs = Math.abs(num);

  // 1. Khoản dưới 1 triệu: hiển thị "k" (ví dụ: 19k, 65k, 500k)
  if (abs < 1000000) {
    const inK = Math.round((abs / 1000) * 10) / 10;
    const formattedK = inK.toLocaleString("vi-VN");
    return `${isNegative ? "-" : ""}${formattedK}k`;
  }

  // 2. Khoản từ 1 triệu trở lên: hiển thị "tr...k" (ví dụ: 3tr450k, 5tr)
  const tr = Math.floor(abs / 1000000);
  const remainingK = Math.round((abs % 1000000) / 1000);

  const text = remainingK === 0 ? `${tr}tr` : `${tr}tr${remainingK}k`;
  return `${isNegative ? "-" : ""}${text}`;
};

/**
 * Định dạng số tiền VNĐ đầy đủ có dấu chấm phân cách (Ví dụ: 3.450.000 đ)
 * Dùng làm chú thích phụ bên dưới
 */
export const formatRawVND = (amount) => {
  const num = Number(amount) || 0;
  return `${Number(num).toLocaleString("vi-VN")} đ`;
};
