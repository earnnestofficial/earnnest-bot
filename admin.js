// ===========================// Earnnest Bot Admin Panel
// Part 1
// ===========================

const API_URL = "https://script.google.com/macros/s/AKfycby1PfOZ8dPri99Uwa2smMd-Nk66l29RC0w6jNH3HMeqQoKNs_G_WITUM71ar5mEmTePjg/exec";

function showPage(page) {

    document.querySelectorAll(".page").forEach(p => {
        p.style.display = "none";
    });

    document.getElementById(page).style.display = "block";
}

window.onload = function () {

    showPage("deposit");

    loadDashboard();
    loadDeposits();
    loadWithdraws();
    loadUsers();
    loadHistory();
};

async function api(action, data = {}) {

    const form = new URLSearchParams();

    form.append("action", action);

    for (const key in data) {
        form.append(key, data[key]);
    }

    const res = await fetch(API_URL, {
        method: "POST",
        body: form
    });

    return await res.json();
}

// ===========================
// Dashboard
// ===========================

async function loadDashboard() {

    const data = await api("adminDashboard");

    document.getElementById("totalUsers").innerText =
        data.totalUsers || 0;

    document.getElementById("pendingDeposits").innerText =
        data.pendingDeposits || 0;

    document.getElementById("pendingWithdraws").innerText =
        data.pendingWithdraws || 0;

    document.getElementById("totalBalance").innerText =
        data.totalBalance || 0;
}

// ===========================
// Pending Deposits
// ===========================

async function loadDeposits() {

    const data = await api("getPendingDeposits");

    const table = document.getElementById("depositTable");

    table.innerHTML = "";

    (data.deposits || []).forEach(item => {

        table.innerHTML += `
        <tr>
            <td>${item.userId}</td>
            <td>${item.name}</td>
            <td>${item.amount}</td>
            <td>${item.method}</td>
            <td>${item.trxId}</td>
            <td>
                <button class="approve"
                    onclick="approveDeposit('${item.id}')">
                    Approve
                </button>

                <button class="reject"
                    onclick="rejectDeposit('${item.id}')">
                    Reject
                </button>
            </td>
        </tr>`;
    });

}

// ===========================
// Deposit Actions
// ===========================

async function approveDeposit(id) {

    if (!confirm("Approve this deposit?")) return;

    const res = await api("approveDeposit", {
        depositId: id,
        admin: "Admin"
    });

    alert(res);

    loadDashboard();
    loadDeposits();
    loadUsers();
    loadHistory();
}

async function rejectDeposit(id) {

    if (!confirm("Reject this deposit?")) return;

    const res = await api("rejectDeposit", {
        id: id
    });

    alert(res.message || "Done");

    loadDashboard();
    loadDeposits();
}

// ===========================
// Withdraws
// ===========================

async function loadWithdraws() {

    const table = document.getElementById("withdrawTable");

    table.innerHTML = "";
}

// ===========================
// Users
// ===========================

async function loadUsers() {

    const table = document.getElementById("usersTable");

    table.innerHTML = "";
}

// ===========================
// History
// ===========================

async function loadHistory() {

    const table = document.getElementById("historyTable");

    table.innerHTML = "";
}
