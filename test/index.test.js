// ! Dont change this code
const {
  fetchProductsData,
  setProductsCards,
  convertToRupiah,
  countDiscount,
} = require("../src/index.js");
const cartData = require("../src/data/cart.js");

// @ Write your code here

// Asyncronous Testing
// https://jestjs.io/docs/asynchronous

describe("Product API Testing", () => {
  // Test Case 1: should return product data with id 1
  // pengujian diberi nama "Product API Testing", yang berfungsi untuk mengelompokkan serangkaian pengujian terkait.
  // Selanjutnya, terdapat satu kasus pengujian yang dijelaskan dengan komentar sebagai "Test Case 1: should return product data with id 1".
  // Kasus pengujian tersebut menggunakan fungsi asynchronous dengan menggunakan async () =>, yang mencakup panggilan ke fungsi fetchProductsData(1).
  // Fungsi ini dirancang untuk mengambil data produk dengan ID 1 dari suatu API atau sumber data eksternal.
  test("should return product data with id 1", async () => {
    const productData = await fetchProductsData(1);
    expect(productData.id).toBe(1);
    expect(productData.title).toBe("iPhone 9");
  });

  // Test Case 2: should check products.length with limit
  // Bagian kode tersebut merupakan tambahan untuk pengujian yang fokus pada verifikasi jumlah produk yang dihasilkan oleh fungsi fetchProductsData dengan membandingkannya dengan batasan (limit) yang telah ditetapkan.
  // Dalam tes ini, data produk diambil secara asynchronous menggunakan fetchProductsData, kemudian diubah menjadi format kartu melalui fungsi setProductsCards. Nilai batasan (limit) dari data produk juga diambil.
  // Selanjutnya, menggunakan Jest expect, dilakukan verifikasi bahwa jumlah kartu produk yang dihasilkan (productsCards.length) sama dengan nilai batasan yang telah ditetapkan.
  // Keseluruhan, pengujian ini bertujuan untuk memastikan bahwa mekanisme batasan produk berfungsi sebagaimana mestinya, dan bahwa jumlah produk yang dihasilkan sesuai dengan harapan yang telah ditetapkan dalam aplikasi.
  test("should check products.length with limit", async () => {
    const productsData = await fetchProductsData();
    const productsCards = setProductsCards(productsData.products);
    const limit = productsData.limit;
    expect(productsCards.length).toBe(limit);
  });

  // Test Case 3: Example of additional test case
  // Dalam tes ini, nilai harga produk ditetapkan sebesar 100 unit, dan persentase diskon ditetapkan sebesar 10%.
  // Selanjutnya, fungsi countDiscount dipanggil untuk menghitung harga setelah diskon berdasarkan harga awal dan persentase diskon yang diberikan. Menggunakan Jest expect, dilakukan verifikasi bahwa hasil perhitungan diskon sesuai dengan nilai yang diharapkan, yaitu 90, setelah mengurangkan 10% dari harga awal (100).
  // Keseluruhan, tes ini dirancang untuk memastikan bahwa fungsi perhitungan diskon bekerja dengan benar dan dapat diandalkan dalam aplikasi, sehingga diskon produk dapat diimplementasikan sesuai dengan persentase yang diinginkan.
  test("should validate product discount calculation", () => {
    const price = 100;
    const discountPercentage = 10;
    const discountedPrice = countDiscount(price, discountPercentage);
    expect(discountedPrice).toBe(90);
  });
});

// Mocking
// https://jestjs.io/docs/mock-functions

const { fetchCartsData } = require("../src/dataService");

jest.mock("../src/dataservice", () => {
  const originalModule = jest.requireActual("../src/dataservice");
  return {
    ...originalModule,
    __esModule: true,
    fetchCartsData: jest.fn(),
  };
});

describe("Cart API Testing", () => {
  // Test case 1
  test("should compare total cart items with length of fetched data", async () => {
    fetchCartsData.mockResolvedValue(cartData.carts);
    const cartsData = await fetchCartsData();
    const totalItems = cartsData.length;
    const expectedTotal = cartData.total;
    expect(totalItems).toBe(expectedTotal);
  });

  // Test case 2
  test("should compare total length of carts data with total", async () => {
    fetchCartsData.mockResolvedValue([
      { id: 1, productId: 1, quantity: 1 },
      { id: 2, productId: 2, quantity: 2 },
    ]);
    const cartsData = await fetchCartsData();
    const totalLength = cartsData.reduce((acc, cart) => acc + cart.quantity, 0);
    expect(totalLength).toBe(3);
  });
});

// Setup & Teardown
// https://jestjs.io/docs/setup-teardown

let productsData; // Variabel untuk menyimpan data produk dari API

// Fetch data produk sebelum menjalankan test suite
beforeAll(async () => {
  productsData = await fetchProductsData();
});

describe("Product Utility Testing", () => {
  describe("convertToRupiah", () => {
    // Test case 1
    test("should convert 100 dollars into rupiah", () => {
      const priceInRupiah = convertToRupiah(100);
      expect(priceInRupiah).toMatch(/Rp\s1\.543\.600,\d{2}/);
      expect(typeof priceInRupiah).toBe("string");
    });

    // Test case 2
    test("should convert 1000 dollars into rupiah", () => {
      const priceInRupiah = convertToRupiah(1000);
      expect(priceInRupiah).toMatch(/Rp\s15\.436\.000,\d{2}/);
    });
  });

  test("should calculate discount correctly", () => {
    // Test case 1
    const discountedPrice1 = countDiscount(100000, 20);
    expect(discountedPrice1).toBe(80000);

    // Test case 2
    const discountedPrice2 = countDiscount(75000, 10);
    expect(discountedPrice2).toBe(67500);
  });

  describe("setProductsCards", () => {
    test("it should return an array of products with specific keys", () => {
      const productsCards = setProductsCards(productsData.products);
      const firstProductKeys = Object.keys(productsCards[0]);
      const expectedKeys = ["price", "after_discount", "image"];
      expect(firstProductKeys).toEqual(expect.arrayContaining(expectedKeys));
    });
  });
});
