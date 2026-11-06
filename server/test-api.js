import app from "./server.js";

// Sử dụng port test ngẫu nhiên trên 127.0.0.1
const server = app.listen(0, "127.0.0.1", async () => {
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  console.log(`\n========================================`);
  console.log(`🧪 BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG BACKEND API`);
  console.log(`   (Server test chạy tại ${baseUrl})`);
  console.log(`========================================\n`);

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  try {
    // 1. Test Health Check
    await test("Health check GET /api/health", async () => {
      const res = await fetch(`${baseUrl}/health`);
      const data = await res.json();
      if (res.status !== 200 || data.status !== "ok") throw new Error("Health check failed");
    });

    // 2. Test Lấy danh sách giao dịch ban đầu (Seed data)
    let initialCount = 0;
    await test("Lấy danh sách giao dịch GET /api/transactions", async () => {
      const res = await fetch(`${baseUrl}/transactions`);
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data)) throw new Error("Không lấy được danh sách");
      initialCount = json.data.length;
      if (initialCount === 0) throw new Error("Dữ liệu seed ban đầu bị rỗng");
    });

    // 3. Test Thêm mới giao dịch thành công
    let createdId = null;
    await test("Thêm giao dịch mới POST /api/transactions", async () => {
      const res = await fetch(`${baseUrl}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Mua trà sữa Matcha Macchiato",
          amount: 55000,
          type: "expense",
          category: "Trà sữa / Cà phê",
          date: new Date().toISOString().split("T")[0],
          note: "Uống giải khát khi học bài",
        }),
      });
      const json = await res.json();
      if (res.status !== 201 || !json.success || !json.data.id) {
        throw new Error(json.message || "Tạo giao dịch không thành công");
      }
      createdId = json.data.id;
    });

    // 4. Test Validation khi thêm giao dịch không hợp lệ
    await test("Validate dữ liệu không hợp lệ POST /api/transactions (title rỗng)", async () => {
      const res = await fetch(`${baseUrl}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "",
          amount: 50000,
          type: "expense",
        }),
      });
      if (res.status !== 400) throw new Error("Server không chặn title rỗng");
    });

    await test("Validate dữ liệu không hợp lệ POST /api/transactions (tiền âm)", async () => {
      const res = await fetch(`${baseUrl}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test âm tiền",
          amount: -20000,
          type: "expense",
        }),
      });
      if (res.status !== 400) throw new Error("Server không chặn số tiền âm");
    });

    // 5. Test Cập nhật giao dịch
    await test(`Cập nhật giao dịch PUT /api/transactions/${createdId}`, async () => {
      const res = await fetch(`${baseUrl}/transactions/${createdId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Mua trà sữa Matcha Macchiato (Upsize L)",
          amount: 65000,
        }),
      });
      const json = await res.json();
      if (!json.success || json.data.amount !== 65000) {
        throw new Error("Cập nhật giao dịch thất bại");
      }
    });

    // 6. Test Thống kê tổng quan & phân bổ
    await test("Lấy thống kê GET /api/stats", async () => {
      const res = await fetch(`${baseUrl}/stats`);
      const json = await res.json();
      if (!json.success || typeof json.data.balance !== "number" || !Array.isArray(json.data.categories)) {
        throw new Error("Dữ liệu thống kê không đúng format");
      }
    });

    // 7. Test Ngân sách
    await test("Lấy và Cập nhật hạn mức ngân sách GET & POST /api/budget", async () => {
      const month = new Date().toISOString().slice(0, 7);
      const postRes = await fetch(`${baseUrl}/budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, limit_amount: 5000000 }),
      });
      const postJson = await postRes.json();
      if (!postJson.success || postJson.data.limit_amount !== 5000000) {
        throw new Error("Lỗi cập nhật ngân sách");
      }

      const getRes = await fetch(`${baseUrl}/budget?month=${month}`);
      const getJson = await getRes.json();
      if (!getJson.success || getJson.data.limit_amount !== 5000000) {
        throw new Error("Lỗi truy vấn ngân sách");
      }
    });

    // 8. Test Xóa giao dịch vừa tạo
    await test(`Xóa giao dịch DELETE /api/transactions/${createdId}`, async () => {
      const res = await fetch(`${baseUrl}/transactions/${createdId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error("Lỗi khi xóa giao dịch");

      // Kiểm tra xem đã thực sự xóa chưa
      const verifyRes = await fetch(`${baseUrl}/transactions`);
      const verifyJson = await verifyRes.json();
      if (verifyJson.data.some((tx) => tx.id === createdId)) {
        throw new Error("Giao dịch vẫn còn tồn tại trong DB sau khi xóa");
      }
    });

    console.log(`\n----------------------------------------`);
    console.log(`KẾT QUẢ KIỂM THỬ: ${passed} PASS, ${failed} FAIL`);
    console.log(`----------------------------------------\n`);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (fatal) {
    console.error("Lỗi nghiêm trọng trong test suite:", fatal);
    process.exit(1);
  } finally {
    server.close();
  }
});
