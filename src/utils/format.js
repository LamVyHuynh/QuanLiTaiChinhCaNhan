/**
 * Hàm định dạng số tiền sang đơn vị "k" (ví dụ: 19.000 -> 19k, 5.500.000 -> 5.500k)
 * Giúp tiết kiệm không gian hiển thị, ngắn gọn và gần gũi với cách gọi hàng ngày.
 */
export const formatMoney = (amount) => {
  const num = Number(amount) || 0;
  const inK = Math.round((num / 1000) * 10) / 10;
  const formatted = inK.toLocaleString("vi-VN");
  return `${formatted}k`;
};
