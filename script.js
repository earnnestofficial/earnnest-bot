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

document.getElementById("loading").style.display = "none";

function updateBalance() {
    document.getElementById("balance").innerHTML = balance + " Coins";
}

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
.then(console.log)
.catch(console.error);

document.getElementById("dailyBtn").onclick = function () {

    let today = new Date().toDateString();
    let last = localStorage.getItem("daily");

    if (today === last) {
        alert("Already Claimed Today");
        return;
    }

    balance += 50;
    localStorage.setItem("balance", balance);
    localStorage.setItem("daily", today);
    updateBalance();

    alert("+50 Coins Added");
};

document.getElementById("adsBtn").onclick = function () {
    alert("Watch Ads feature coming soon!");
};

document.getElementById("refBtn").onclick = function () {
    alert("Referral feature coming soon!");
};

document.getElementById("withdrawBtn").onclick = function () {

    if (balance < 1000) {
        alert("Minimum 1000 Coins Required");
        return;
    }

    alert("Withdraw Request Submitted");
};
