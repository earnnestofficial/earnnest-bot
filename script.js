// ==========================================
// Earnnest Bot V3.1 Final
// Part 1
// ==========================================

// ===== Telegram =====
Telegram.WebApp.ready();
Telegram.WebApp.expand();

const tg = Telegram.WebApp;

// ===== Developer Mode =====
const DEV_MODE =
  typeof Telegram === "undefined" ||
  !Telegram.WebApp ||
  !Telegram.WebApp.initDataUnsafe ||
  !Telegram.WebApp.initDataUnsafe.user;

const user = DEV_MODE
  ? {
      id: "999999999",
      first_name: "Developer"
    }
  : Telegram.WebApp.initDataUnsafe.user;
const userRefLink =
"https://t.me/earnnesstbot?startapp=ER" + user.id;

console.log("Developer Mode:", DEV_MODE);
console.log("User:", user);

// ===== API =====

const API_URL = "https://script.google.com/macros/s/AKfycby1PfOZ8dPri99Uwa2smMd-Nk66l29RC0w6jNH3HMeqQoKNs_G_WITUM71ar5mEmTePjg/exec";
// ===== User =====
let balance = 0;

// ===== UI =====

const loading = document.getElementById("loading");
const username = document.getElementById("username");
const userid = document.getElementById("userid");
const balanceText = document.getElementById("balance");

// ===== Withdraw =====
const withdrawModal = document.getElementById("withdrawModal");
const withdrawMethod = document.getElementById("withdrawMethod");
const withdrawAccount = document.getElementById("withdrawAccount");
const withdrawCoins = document.getElementById("withdrawCoins");

// ===== Deposit =====
const depositModal = document.getElementById("depositModal");
const depositMethod = document.getElementById("depositMethod");
const depositAmount = document.getElementById("depositAmount");
const depositTrxId = document.getElementById("depositTrxId");
const depositNumber = document.getElementById("depositNumber");

// ===== Referral =====
const referralModal = document.getElementById("referralModal");
const refLink = document.getElementById("refLink");
const totalReferrals = document.getElementById("totalReferrals");

// ==========================================
// UI
// ==========================================

username.innerHTML =
" Welcome, " + (user.first_name || "User");

userid.innerHTML =
"User ID: " + (user.id || "Unknown");

function updateBalance(){
    balanceText.innerHTML = balance + " Coins";
}

// ==========================================
// Loading
// ==========================================

window.onload = function(){
    loading.style.display = "none";
};

// ==========================================
// Login
// ==========================================

function login(){

    fetch(API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:
        "action=login"+
        "&userId="+encodeURIComponent(user.id||"")+
        "&name="+encodeURIComponent(user.first_name||"")+
        "&referral="
    })
    .then(res=>res.text())
    .then(data=>{

        if (data == "REGISTER") {
    registerUser();
    return;
}

const coins = Number(data);

if (!isNaN(coins)) {
    balance = coins;
    updateBalance();
}

getBalance();
})
.catch(() => {
    showToast("Server Error");
});
}

// ==========================================
// Get Balance
// ==========================================

function getBalance(){

    fetch(API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:
        "action=getBalance"+
        "&userId="+encodeURIComponent(user.id||"")
    })
    .then(res=>res.text())
    .then(data=>{

        const coins = Number(data);

        if(!isNaN(coins)){
            balance = coins;
            updateBalance();
        }

    })
    .catch(()=>{

        showToast("Balance Load Failed");

    });

}

// ======================
// GET REFERRAL FROM TELEGRAM START PARAM
// ======================

const startParam =
    tg.initDataUnsafe?.start_param || "";

if (startParam) {
    const referralInput = document.getElementById("referral");

    if (referralInput) {
        referralInput.value = startParam;
    }
}
// ==========================================
// Start App
// ==========================================
login();

// ======================
// REGISTRATION
// ======================

const registerModal = document.getElementById("registerModal");

function registerUser(){
    registerModal.style.display = "flex";
}

document.getElementById("submitRegister").onclick = function(){

    const phone = document.getElementById("phone").value.trim();
    const payment = document.getElementById("payment").value.trim();
    const referral = document.getElementById("referral").value.trim();

    if(phone==""){
        showToast("Enter Phone Number");
        return;
    }

    if(payment==""){
        showToast("Enter Payment Number");
        return;
    }

    fetch(API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:
        "action=registerUser"+
        "&userId="+encodeURIComponent(user.id)+
        "&name="+encodeURIComponent(user.first_name)+
        "&phone="+encodeURIComponent(phone)+
        "&payment="+encodeURIComponent(payment)+
        "&referral="+encodeURIComponent(referral)
    })
    .then(res=>res.text())
    .then(data=>{

        if(data=="SUCCESS"){
            registerModal.style.display="none";
            showToast("Registration Successful");
            login();
        }else{
            showToast(data);
        }

    })
    .catch(()=>{
        showToast("Server Error");
    });

};

// ==========================================
// Part 2
// Daily Bonus + Watch Ads + Referral
// ==========================================

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

        data = data.trim();

        if(data === "ALREADY"){
            showToast("Already Claimed Today");
            return;
        }

        const coins = Number(data);

        if(!isNaN(coins)){
            balance = coins;
            updateBalance();
            showToast("+10 Coins Added");
        }else{
            showToast("Daily Bonus Failed");
        }

    })
    .catch(()=>{
        showToast("Server Error");
    });

};

// ======================
// WATCH ADS
// ======================

document.getElementById("adsBtn").onclick = function(){

    if(typeof show_11437158 !== "function"){
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

            const coins = Number(data);

            if(!isNaN(coins)){
                balance = coins;
                updateBalance();
                showToast("+2 Coins Added");
            }else{
                showToast("Reward Failed");
            }

        })
        .catch(()=>{
            showToast("Server Error");
        });

    })
    .catch(()=>{

        showToast("Ad Cancelled");

    });

};

// ======================
// REFERRAL
// ======================

document.getElementById("refBtn").onclick = function () {
    openReferral();
};

document.getElementById("referralBtn").onclick = function () {
    openReferral();
};

// ==========================================
// Part 3
// Deposit + Withdraw
// ==========================================

// ======================
// OPEN DEPOSIT
// ======================

document.getElementById("depositBtn").onclick = function(){

    depositMethod.value = "";
    depositAmount.value = "";
    depositTrxId.value = "";
    depositNumber.value = "";

    depositModal.style.display = "flex";

};

document.getElementById("closeDeposit").onclick = function(){

    depositModal.style.display = "none";

};

// ======================
// SUBMIT DEPOSIT
// ======================

document.getElementById("submitDeposit").onclick = function(){

    const method = depositMethod.value;
    const amount = Number(depositAmount.value);
    if (!Number.isFinite(amount) || amount <= 0) {
    showToast("Enter a valid amount");
    return;
}
const trxId = depositTrxId.value.trim();
    const number = depositNumber.value.trim();

    if(method==""){
        showToast("Select Deposit Method");
        return;
    }

    if(isNaN(amount) || amount<100){
        showToast("Minimum Deposit 100");
        return;
    }

    if(trxId==""){
        showToast("Enter Transaction ID");
        return;
    }

    if(number==""){
        showToast("Enter Sender Number");
        return;
    }

    fetch(API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:
        "action=deposit"+
        "&userId="+encodeURIComponent(user.id||"")+
        "&method="+encodeURIComponent(method)+
        "&amount="+encodeURIComponent(amount)+
        "&trxId="+encodeURIComponent(trxId)+
        "&paymentNumber="+encodeURIComponent(number)
    })
    .then(res=>res.text())
    .then(data=>{

        if(data=="INVALID"){
            showToast("Invalid Deposit Information");
            return;
        }

        if(data=="USER_NOT_FOUND"){
            showToast("User Not Found");
            return;
        }

        showToast("Deposit ID : " + data);

        depositModal.style.display="none";

        depositMethod.value="";
        depositAmount.value="";
        depositTrxId.value="";
        depositNumber.value="";

    })
    .catch(()=>{

        showToast("Server Error");

    });

};

// ======================
// WITHDRAW
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

document.getElementById("submitWithdraw").onclick=function(){

    const method = withdrawMethod.value;
    const account = withdrawAccount.value.trim();
    const coins = Number(withdrawCoins.value);

    if(method==""){
        showToast("Select Withdraw Method");
        return;
    }

    if(account==""){
        showToast("Enter Account Number");
        return;
    }

    if(isNaN(coins) || coins<1000){
        showToast("Minimum 1000 Coins");
        return;
    }

    if(coins>balance){
        showToast("Insufficient Balance");
        return;
    }

    fetch(API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:
        "action=withdraw"+
        "&userId="+encodeURIComponent(user.id||"")+
        "&method="+encodeURIComponent(method)+
        "&account="+encodeURIComponent(account)+
        "&coins="+encodeURIComponent(coins)
    })
    .then(res=>res.text())
    .then(data=>{

        if(data=="COMING_SOON"){
    showToast("Withdraw Coming Soon");
    return;
}

if(data=="PENDING_WITHDRAW"){
    showToast("You Already Have a Pending Withdraw");
    return;
}

if(data=="INSUFFICIENT_BALANCE"){
    showToast("Insufficient Balance");
    return;
}

if(data=="MINIMUM_1000"){
    showToast("Minimum 1000 Coins");
    return;
}

        showToast("Request Submitted (Pending Approval)");

withdrawModal.style.display = "none";

getBalance();

    })
    .catch(()=>{

        showToast("Server Error");

    });

};

// ==========================================
// Earnnest Bot V3.1 Final
// Part 4
// Bottom Navigation + Toast
// ==========================================

// ======================
// BOTTOM NAVIGATION
// ======================

document.getElementById("homeBtn").onclick = function () {
    showToast("Home");
};

document.getElementById("earnBtn").onclick = function () {
    showToast("Earn");
};

document.getElementById("profileBtn").onclick = function () {
    showToast("Profile");
};

// ======================
// TOAST
// ======================

function showToast(message){

    const toast = document.getElementById("toast");

    toast.innerHTML = message;

    toast.style.display = "block";
    toast.classList.add("show");

    setTimeout(function(){

        toast.classList.remove("show");
        toast.style.display = "none";

    },2500);

}

// ======================
// MODAL CLOSE (Outside Click)
// ======================

window.onclick = function(event){

    if(event.target === depositModal){
        depositModal.style.display = "none";
    }

    if(event.target === withdrawModal){
        withdrawModal.style.display = "none";
    }


  if(event.target === registerModal){
        registerModal.style.display = "none";
    }
    
};

// ==============================
// REFERRAL SYSTEM
// ==============================

function openReferral(){

    const referralModal =
        document.getElementById("referralModal");

    const refLink =
        document.getElementById("refLink");

    if(!referralModal || !refLink){
        showToast("Referral system error");
        return;
    }

    // Create referral link
    const referralLink =
        "https://t.me/earnnesstbot?start=" + user.id;

    // Show link
    refLink.value = referralLink;

    // Open modal
    referralModal.style.display = "flex";
}


// ==============================
// CLOSE REFERRAL
// ==============================

document.getElementById("closeReferral").onclick = function(){

    const referralModal =
        document.getElementById("referralModal");

    if(referralModal){
        referralModal.style.display = "none";
    }

};


// ==============================
// COPY REFERRAL LINK
// ==============================

document.getElementById("copyRefBtn").onclick = function(){

    const refLink =
        document.getElementById("refLink");

    if(!refLink){
        showToast("Referral link not found");
        return;
    }

    const text = refLink.value;

    if(navigator.clipboard){

        navigator.clipboard.writeText(text)
        .then(function(){

            showToast("Referral Link Copied");

        })
        .catch(function(){

            refLink.select();
            document.execCommand("copy");

            showToast("Referral Link Copied");

        });

    }else{

        refLink.select();
        document.execCommand("copy");

        showToast("Referral Link Copied");
    }

};


// ==============================
// REFERRAL BUTTON
// ==============================

document.getElementById("referralBtn").onclick = function(){

    openReferral();

};

// ======================
// VERSION
// ======================

console.log("Earnnest Bot V3.1 Final Loaded");
