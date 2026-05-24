// =============================
// اجرای بعد از لود صفحه
// =============================
let usdPrice, goldPrice, btcPrice, usdtPrice;
let usdLoading, goldLoading, btcLoading, usdtLoading;
let countdownEl;

document.addEventListener("DOMContentLoaded", () => {
  // گرفتن المنت‌ها بعد از لود DOM
  usdPrice = document.getElementById("usd-price");
  goldPrice = document.getElementById("gold-price");
  btcPrice = document.getElementById("btc-price");
  usdtPrice = document.getElementById("usdt-price");

  usdLoading = document.getElementById("usd-loading");
  goldLoading = document.getElementById("gold-loading");
  btcLoading = document.getElementById("btc-loading");
  usdtLoading = document.getElementById("usdt-loading");

  countdownEl = document.getElementById("countdown");

  updatePrices();
  startCountdown();

  setInterval(updatePrices, 30000);
});


// =============================
// loading handler
// =============================
function showLoading() {
  usdLoading.style.display = "block";
  goldLoading.style.display = "block";
  btcLoading.style.display = "block";
  usdtLoading.style.display = "block";
}

function hideLoading() {
  usdLoading.style.display = "none";
  goldLoading.style.display = "none";
  btcLoading.style.display = "none";
  usdtLoading.style.display = "none";
}


// =============================
// تایمر 30 ثانیه
// =============================
function startCountdown() {
  let time = 30;

  setInterval(() => {
    time--;
    countdownEl.textContent = time;

    if (time <= 0) time = 30;
  }, 1000);
}


// =============================
// گرفتن همه قیمت‌ها (نسخه حرفه‌ای)
// =============================
async function updatePrices() {
  showLoading();

  try {
    // ---------- crypto (Bitcoin + Tether) ----------
    const cryptoRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=usd"
    );
    const cryptoData = await cryptoRes.json();

    // ---------- دلار ایران (از تتر بازار ایران) ----------
    const dollarRes = await fetch("https://api.nobitex.ir/market/stats");
    const dollarData = await dollarRes.json();

    // قیمت تتر در ایران ≈ دلار ایران
    const dollarRial = Number(dollarData.stats["usdt-rls"].latest);
    const dollarToman = Math.round(dollarRial / 10);

    // ---------- بیتکوین ----------
    btcPrice.textContent =
      "$" + cryptoData.bitcoin.usd.toLocaleString();

    // ---------- دلار ایران ----------
    usdPrice.textContent =
      dollarToman.toLocaleString() + " تومان";

    // ---------- تتر به تومان ----------
    const usdtToman =
      cryptoData.tether.usd * dollarToman;

    usdtPrice.textContent =
      Math.round(usdtToman).toLocaleString() + " تومان";

    // ---------- طلا (تخمینی از قیمت جهانی) ----------
    // فعلاً از قیمت جهانی و تبدیل به تومان
    const goldGlobalPrice = 2020; // قیمت جهانی هر اونس (تست)
    const goldToman = goldGlobalPrice * dollarToman;

    goldPrice.textContent =
      Math.round(goldToman).toLocaleString() + " تومان";

    hideLoading();

  } catch (error) {
    console.error("Error fetching prices:", error);

    usdPrice.textContent = "خطا";
    goldPrice.textContent = "خطا";
    btcPrice.textContent = "خطا";
    usdtPrice.textContent = "خطا";

    hideLoading();
  }
}