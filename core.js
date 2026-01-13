// ==========================================
// 1. DATA MASTER & KONEKSI
// ==========================================
const SERVER_IP = "192.168.1.2"; 
const MASTER_KEY = "Monzyprdc2026";
const CREATOR_PHONE = "6285758422171";
const CREATOR_CODE  = "Monzyprdc2026";

// ==========================================
// 2. FIX LOGIN & NAVIGASI (Agar tidak Freeze)
// ==========================================
function switchTab(type) {
    // Pastikan elemen ada sebelum diubah style-nya
    const viewReq = document.getElementById('view-request');
    const viewDev = document.getElementById('view-dev');
    
    if(viewReq && viewDev) {
        if (type === 'request') {
            viewReq.style.display = 'block';
            viewDev.style.display = 'none';
        } else {
            viewReq.style.display = 'none';
            viewDev.style.display = 'block';
        }
    }
}

function creatorLogin() {
    const inputNum = document.getElementById('dev-num').value;
    const inputCode = document.getElementById('dev-code').value;

    if (inputNum === CREATOR_PHONE && inputCode === CREATOR_CODE) {
        // Efek masuk ke panel utama
        const gate = document.getElementById('gate-screen');
        const console = document.getElementById('master-console');
        
        if(gate) gate.style.display = 'none';
        if(console) console.style.display = 'flex';
        
        console.log("Pencipta Terverifikasi. Sistem Aktif.");
    } else {
        alert("Akses Ditolak: Kredensial Salah.");
    }
}

// ==========================================
// 3. LOGIKA REMOTE (KE TERMUX)
// ==========================================
async function sendCommand(actionName, val) {
    const log = document.getElementById('log-output');
    
    try {
        if(log) log.innerHTML += `<br>> Mengirim ${actionName}...`;
        
        const response = await fetch(`http://${SERVER_IP}:3000/api/system-control`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "x-monzy-key": MASTER_KEY 
            },
            body: JSON.stringify({ action: actionName, value: val })
        });

        const data = await response.json();
        if(log) log.innerHTML += `<br><span style="color:#00ff41;">> OK: ${data.message}</span>`;
    } catch (error) {
        if(log) log.innerHTML += `<br><span style="color:red;">> Server Offline (Check Termux)</span>`;
    }
}

// Tombol Aksi
function triggerForceLogout() {
    if(confirm("Paksa Logout Semua?")) sendCommand("logout_all", Date.now());
}

function toggleMaintenance() {
    sendCommand("maintenance", true);
    alert("Maintenance Mode Terkirim!");
}

// ==========================================
// 4. PERSISTENCE GUARD [cite: 2025-12-30]
// ==========================================
setInterval(() => {
    fetch(`http://${SERVER_IP}:3000/api/check-persistence/health`).catch(() => {});
}, 10000);
