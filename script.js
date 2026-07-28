Telegram.WebApp.ready();
Telegram.WebApp.expand();

const tg = Telegram.WebApp;
const user = tg.initDataUnsafe.user || {};

const API_URL = "https://script.google.com/macros/s/AKfycbyiMpkqFKQ6uaE_NTN4IrGt9wE5h2upESzEs4sr_wkMORp4VBkN_L1EUNSYSnuL6UF5fw/exec";

document.getElementById("username").innerHTML =
" Welcome, " + (user.first_name || "User");

document.getElementById("userid").innerHTML =
"User ID: " + (user.id || "");

let balance = 0;

const withdrawModal = document.getElementById("withdrawModal");
const withdrawMethod = document.getElementById("withdrawMethod");
const withdrawAccount = document.getElementById("withdrawAccount");
const withdrawCoins = document.getElementById("withdrawCoins");

function updateBalance(){
    document.getElementById("balance").innerHTML =
    balance + " Coins";
}

window.onload = function(){
    document.getElementById("loading").style.display="none";
};

// Login

fetch(API_URL,{
    method:"POST",
    headers:{
        "Content-Type":"application/x-www-form-urlencoded"
    },
    body:
    "action=login"+
    "&userId="+encodeURIComponent(user.id||"")+
    "&name="+encodeURIComponent(user.first_name||"")
})
.then(res=>res.text())
.then(()=>{

    return fetch(API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:
        "action=getBalance"+
        "&userId="+encodeURIComponent(user.id||"")
    });

})
.then(res=>res.text())
.then(data=>{

    const coins=Number(data);

    if(!isNaN(coins)){
        balance=coins;
        updateBalance();
    }

});

// ======================
// DAILY BONUS
// ======================

document.getElementById("dailyBtn").onclick = function(){

    fetch(API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:
        "action=daily"+
        "&userId="+encodeURIComponent(user.id||"")
    })
    .then(res=>res.text())
    .then(data=>{

        if(data==="claimed"){
            showToast("Already Claimed Today");
            return;
        }

        const coins=Number(data);

        if(!isNaN(coins)){
            balance=coins;
            updateBalance();
            showToast("+50 Coins Added");
        }

    });

};

// ======================
// WATCH ADS
// ======================

document.getElementById("adsBtn").onclick=function(){

    if(typeof show_11437158!=="function"){
        showToast("Ad SDK Not Loaded");
        return;
    }

    showToast("Loading Ad...");

    show_11437158()
    .then(()=>{

        fetch(API_URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            body:
            "action=reward"+
            "&userId="+encodeURIComponent(user.id||"")
        })
        .then(res=>res.text())
        .then(data=>{

            const coins=Number(data);

            if(!isNaN(coins)){
                balance=coins;
            }else{
                balance+=20;
            }

            updateBalance();
            showToast("+20 Coins Added");

        });

    })
    .catch(()=>{

        showToast("Ad Cancelled");

    });

};

// ======================
// REFERRAL
// ======================

document.getElementById("refBtn").onclick=function(){

    showToast("Referral System Coming Soon");

};

// ======================
// WITHDRAW POPUP
// ======================

document.getElementById("withdrawBtn").onclick=function(){

    if(balance<1000){
        showToast("Minimum 1000 Coins Required");
        return;
    }

    withdrawMethod.value="";
    withdrawAccount.value="";
    withdrawCoins.value="";

    withdrawModal.style.display="flex";

};

document.getElementById("closeWithdraw").onclick=function(){

    withdrawModal.style.display="none";

};

// ======================
// SUBMIT WITHDRAW
// ======================

document.getElementById("submitWithdraw").onclick = function () {

    const method = withdrawMethod.value;
    const account = withdrawAccount.value.trim();
    const coins = Number(withdrawCoins.value);

    if (method == "") {
        showToast("Select Withdraw Method");
        return;
    }

    if (account == "") {
        showToast("Enter Account Number");
        return;
    }

    if (isNaN(coins) || coins < 1000) {
        showToast("Minimum 1000 Coins");
        return;
    }

    if (coins > balance) {
        showToast("Insufficient Balance");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:
            "action=withdraw" +
            "&userId=" + encodeURIComponent(user.id || "") +
            "&method=" + encodeURIComponent(method) +
            "&account=" + encodeURIComponent(account) +
            "&coins=" + encodeURIComponent(coins)
    })
    .then(res => res.text())
    .then(data => {

        if (data == "INSUFFICIENT") {
            showToast("Insufficient Balance");
            return;
        }

        if (data == "USER_NOT_FOUND") {
            showToast("User Not Found");
            return;
        }

        const newBalance = Number(data);

        if (!isNaN(newBalance)) {
            balance = newBalance;
            updateBalance();

            withdrawModal.style.display = "none";

            showToast("Withdraw Request Submitted");
        }

    });

};

// ======================
// BOTTOM NAVIGATION
// ======================

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

// ======================
// TOAST
// ======================

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.innerHTML = message;
    toast.classList.add("show");

    toast.style.display = "block";

    setTimeout(function () {
        toast.classList.remove("show");
        toast.style.display = "none";
    }, 2500);

}
