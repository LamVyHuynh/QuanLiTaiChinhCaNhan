/**
 * Hàm định dạng số tiền tối ưu, siêu ngắn gọn và đồng nhất theo đơn vị "k" và "tr":
 * - Dưới 1 triệu: Hiển thị dạng "k" (Ví dụ: 19.000 -> 19k, 65.000 -> 65k)
 * - Từ 1 triệu trở lên: Hiển thị dạng "tr...k" (Ví dụ: 3.450.000 -> 3tr450k, 5.000.000 -> 5tr, 2.200.000 -> 2tr200k)
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
 */
export const formatRawVND = (amount) => {
  const num = Number(amount) || 0;
  return `${Number(num).toLocaleString("vi-VN")} đ`;
};

/**
 * Hàm phân tích số tiền thông minh từ chuỗi người dùng nhập:
 * - Hỗ trợ nhập số kết hợp chữ:
 *   + "19k", "19.5k" -> 19.000, 19.500
 *   + "1tr", "1.5tr", "1tr5", "3tr450k", "3tr450", "2tr2", "5tr" -> 1.000.000, 1.500.000, 3.450.000...
 *   + "1ty", "1.5ty", "2ty5", "1tỷ" -> 1.000.000.000, 1.500.000.000, 2.500.000.000...
 *   + Hỗ trợ từ lóng: "cu", "củ" -> "tr", "canh", "cành" -> "k"
 * - Hỗ trợ nhập số thuần túy có dấu chấm phân cách:
 *   + "19000", "19.000", "1.500.000", "3500000"
 *   + Số nhỏ dưới 1000 không có dấu chấm (như "19", "50") tự động hiểu là "19k", "50k"
 */
export const parseSmartAmount = (input) => {
  if (!input) return 0;
  let s = String(input).trim().toLowerCase();
  s = s.replace(/\s+/g, "");
  if (!s) return 0;

  // Hỗ trợ từ lóng quen thuộc
  s = s.replace(/củ|cu/g, "tr").replace(/cành|canh/g, "k");

  // 1. Tỷ: ví dụ 1ty, 1.5ty, 1ty5, 2ty500, 1tỷ
  if (s.includes("ty") || s.includes("tỷ")) {
    const parts = s.split(/ty|tỷ/);
    const main = parseFloat(parts[0].replace(",", ".")) || 0;
    let extra = 0;
    if (parts[1]) {
      const sub = parts[1].replace(/tr|k/g, "");
      const subNum = parseFloat(sub.replace(",", ".")) || 0;
      if (parts[1].includes("tr")) {
        extra = subNum * 1000000;
      } else if (sub.length === 1) {
        extra = subNum * 100000000; // 1ty5 = 1 tỷ 500 triệu
      } else if (sub.length === 2) {
        extra = subNum * 10000000;
      } else {
        extra = subNum * 1000000;
      }
    }
    return Math.round(main * 1000000000 + extra);
  }

  // 2. Triệu / Tr: ví dụ 1tr, 1.5tr, 1tr5, 3tr450k, 3tr450
  if (s.includes("tr") || s.includes("m")) {
    const parts = s.split(/tr|m/);
    const main = parseFloat(parts[0].replace(",", ".")) || 0;
    let extra = 0;
    if (parts[1]) {
      const sub = parts[1].replace(/k/g, "");
      const subNum = parseFloat(sub.replace(",", ".")) || 0;
      if (sub.length === 1) {
        extra = subNum * 100000; // 1tr5 = 1.500.000
      } else if (sub.length === 2) {
        extra = subNum * 10000; // 1tr25 = 1.250.000
      } else {
        extra = subNum * 1000; // 3tr450 = 3.450.000
      }
    }
    return Math.round(main * 1000000 + extra);
  }

  // 3. Nghìn / K: ví dụ 19k, 19.5k, 500k
  if (s.includes("k")) {
    const clean = s.replace(/k/g, "").replace(",", ".");
    const val = parseFloat(clean) || 0;
    return Math.round(val * 1000);
  }

  // 4. Số thuần (ví dụ: 19000, 1.500.000, 3500000 hoặc 19)
  const normalized = s.replace(/\./g, "").replace(/,/g, "");
  const num = parseFloat(normalized);
  if (isNaN(num)) return 0;
  if (num > 0 && num < 1000 && !s.includes(".")) {
    return Math.round(num * 1000);
  }
  return Math.round(num);
};

/**
 * Đọc số tiền thành văn bản tiếng Việt dễ hiểu
 * Ví dụ: 3.450.000 -> "3 triệu 450 nghìn đ"
 */
export const numberToVietnameseWords = (amount) => {
  const num = Number(amount);
  if (!num || isNaN(num) || num <= 0) return "";

  if (num >= 1000000000) {
    const ty = Math.floor(num / 1000000000);
    const rem = num % 1000000000;
    const tr = Math.floor(rem / 1000000);
    if (tr > 0) return `${ty} tỷ ${tr} triệu đ`;
    return `${ty} tỷ đ`;
  }
  if (num >= 1000000) {
    const tr = Math.floor(num / 1000000);
    const k = Math.floor((num % 1000000) / 1000);
    if (k > 0) return `${tr} triệu ${k} nghìn đ`;
    return `${tr} triệu đ`;
  }
  if (num >= 1000) {
    const k = Math.floor(num / 1000);
    const rem = num % 1000;
    if (rem > 0) return `${k} nghìn ${rem} đ`;
    return `${k} nghìn đ`;
  }
  return `${num.toLocaleString("vi-VN")} đ`;
};
