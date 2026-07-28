Telegram.WebApp.ready();
Telegram.WebApp.expand();

const tg = Telegram.WebApp;
const user = tg.initDataUnsafe.user || {};

const API_URL = "https://script.google.com/macros/s/AKfycbyiMpkqFKQ6uaE_NTN4IrGt9wE5h2upESzEs4sr_wkMORp4VBkN_L1EUNSYSnuL6UF5fw/exec";

document.getElementById("username").innerHTML =
"👋 Welcome, " + (user.first_name || "User");

document.getElementById("userid").innerHTML =
"User ID: " + (user.id || "");

let balance = 0;
updateBalance();

// Hide Loading
window.onload = function () {
    document.getElementById("loading").style.display = "none";
};

// Update Balance
function updateBalance() {
    document.getElementById("balance").innerHTML = balance + " Coins";
}

// Login
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
.then(res => res.text())
.then(() => {

    return fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:
            "action=getBalance" +
            "&userId=" + encodeURIComponent(user.id || "")
    });

})
.then(res => res.text())
.then(data => {

    let coins = Number(data);

    if (!isNaN(coins)) {
        balance = coins;
        updateBalance();
    }

});

// Daily Bonus
document.getElementById("dailyBtn").onclick = function () {

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:
            "action=daily" +
            "&userId=" + encodeURIComponent(user.id || "")
    })
    .then(res => res.text())
    .then(data => {

        if (data === "claimed") {
            showToast("Already Claimed Today");
            return;
        }

        balance = Number(data);

        if (!isNaN(balance)) {
            updateBalance();
            showToast("+50 Coins Added");
        }

    });

};

// ======================
// WATCH ADS (MONETAG)
// ======================

document.getElementById("adsBtn").onclick = function () {

    if (typeof show_11437158 !== "function") {
        showToast("Ad SDK Not Loaded");
        return;
    }

    showToast("Loading Ad...");

    show_11437158()
    .then(() => {

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                "action=reward" +
                "&userId=" + encodeURIComponent(user.id || "")
        })
        .then(res => res.text())
        .then(data => {

            let coins = Number(data);

            if (!isNaN(coins)) {
                balance = coins;
            } else {
                balance += 20;
            }

            updateBalance();

            showToast("+20 Coins Added");

        });

    })
    .catch(() => {

        showToast("Ad Cancelled");

    });

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

// Toast
function showToast(message) {

    const toast = document.getElementById("toast");

    toast.innerHTML = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);

}
