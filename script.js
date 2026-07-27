Telegram.WebApp.ready();
Telegram.WebApp.expand();

const tg = Telegram.WebApp;
const user = tg.initDataUnsafe.user || {};

const API_URL = "https://script.google.com/macros/s/AKfycbyiMpkqFKQ6uaE_NTN4IrGt9wE5h2upESzEs4sr_wkMORp4VBkN_L1EUNSYSnuL6UF5fw/exec";

document.getElementById("username").innerHTML =
"👋 Welcome, " + (user.first_name || "User");

document.getElementById("userid").innerHTML =
"User ID: " + (user.id || "");

let balance = Number(localStorage.getItem("balance")) || 0;
updateBalance();

// Hide loading
window.onload = function () {
    document.getElementById("loading").style.display = "none";
};

function updateBalance() {
    document.getElementById("balance").innerHTML = balance + " Coins";
}

// Login API
fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body:
        "action=login" +
        "&userId=" + encodeURIComponent(user.id || "") +
        "&name=" + encodeURIComponent(user.first_name || "")
})
.then(r => r.text())
.then(console.log);

// Daily Bonus
document.getElementById("dailyBtn").onclick = function () {

    let today = new Date().toDateString();
    let last = localStorage.getItem("daily");

    if (today === last) {
        showToast("Already Claimed Today");
        return;
    }

    balance += 50;
    localStorage.setItem("balance", balance);
    localStorage.setItem("daily", today);

    updateBalance();
    showToast("+50 Coins Added");
};

// Watch Ads
document.getElementById("adsBtn").onclick = function () {
    showToast("Ads Coming Soon");
};

// Referral
document.getElementById("refBtn").onclick = function () {
    showToast("Referral System Coming Soon");
};

// Withdraw
document.getElementById("withdrawBtn").onclick = function () {

    if (balance < 1000) {
        showToast("Minimum 1000 Coins Required");
        return;
    }

    showToast("Withdraw Request Submitted");
};

// Bottom Navigation
document.getElementById("homeBtn").onclick = function () {
    showToast("Home");
};

document.getElementById("earnBtn").onclick = function () {
    showToast("Earn");
};

document.getElementById("referralBtn").onclick = function () {
    showToast("Referral");
};

document.getElementById("profileBtn").onclick = function () {
    showToast("Profile");
};

// Toast Function
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerHTML = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
