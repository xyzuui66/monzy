// ==========================================
// KONFIGURASI PUSAT
// ==========================================
const SERVER_IP = "192.168.1.2"; // IP Termux kamu
const MASTER_KEY = "Monzyprdc2026";

// ==========================================
// FUNGSI NAVIGASI (TAB)
// ==========================================
function switchTab(type) {
    const sections = ['view-request', 'view-dev', 'master-console'];
    sections.forEach(s => {
        const el = document.getElementById(s);
        if(el) el.style.display = 'none';
    });

    if (type === 'request') {
        document.getElementById('view-request').style.display = 'block';
    } else if (type === 'dev') {
        document.getElementById('view-dev').style.display = 'block';
    }
}

// ==========================================
// LOGIKA KIRIM PERINTAH KE SERVER TERMUX
// ==========================================
// Ini adalah gabungan kode fetch yang kamu tanyakan
async function sendCommand(actionName, val) {
    const log = document.getElementById('log-output'); // Panel hitam di web
    
    try {
        log.innerHTML += `<br>> Mengirim sinyal ${actionName}...`;
        
        const response = await fetch(`http://${SERVER_IP}:3000/api/system-control`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "x-monzy-key": MASTER_KEY 
            },
            body: JSON.stringify({ action: actionName, value: val })
        });

        const data = await response.json();
        log.innerHTML += `<br><span style="color:#00ff41;">> Server: ${data.message}</span>`;
        alert("Perintah Berhasil Dieksekusi!");
        
    } catch (error) {
        log.innerHTML += `<br><span style="color:red;">> Error: Gagal koneksi ke ${SERVER_IP}. Pastikan Termux ON!</span>`;
        console.error("Connection Error:", error);
    }
}

// ==========================================
// TOMBOL KHUSUS REMOTE
// ==========================================
function triggerForceLogout() {
    if(confirm("Paksa semua user keluar?")) {
        sendCommand("logout_all", Date.now());
    }
}

function toggleMaintenance() {
    const status = confirm("Aktifkan mode pemeliharaan?");
    sendCommand("maintenance", status);
}

// ==========================================
// CEK STATUS SERVER (OTOMATIS)
// ==========================================
function pingServer() {
    fetch(`http://${SERVER_IP}:3000/api/check-persistence/health`)
        .then(() => {
            console.log("Server Monzy Active");
        })
        .catch(() => {
            console.warn("Server Monzy Offline. Check Termux!");
        });
}

// Jalankan cek tiap 10 detik
setInterval(pingServer, 10000);

        firebase.initializeApp(config);
        remoteDb = firebase.database();

        log.innerText = "Link Active: " + projectId;
        log.style.color = "#2ecc71";

        // Sinkronisasi data real-time ke Terminal View
        firebase.database().ref('/').on('value', (snapshot) => {
            const data = snapshot.val();
            document.getElementById('raw-data').innerHTML = `
                <pre style="color: #2ecc71;">// Data Streamed at ${new Date().toLocaleTimeString()}\n\n${JSON.stringify(data, null, 4)}</pre>
            `;
        });

    } catch (error) {
        log.innerText = "Link Failed.";
        log.style.color = "#e74c3c";
        alert("Gagal menautkan project: " + error.message);
    }
}

// ==========================================
// FUNGSI REMOTE OVERRIDE
// ==========================================
function remoteAction(type) {
    if (!remoteDb) {
        alert("Hubungkan ke Project Firebase terlebih dahulu!");
        return;
    }

    if (type === 'logout_all') {
        if (confirm("Paksa semua user logout (Menghapus Persistence)?")) {
            remoteDb.ref('system_control/force_logout_trigger').set(Date.now());
            alert("Perintah Force Logout dikirim.");
        }
    } else if (type === 'maintenance') {
        remoteDb.ref('system_control/maintenance_mode').transaction((current) => {
            return !current;
        });
        alert("Status Maintenance Mode berhasil diubah.");
    }
}

function terminateSession() {
    if (confirm("Matikan koneksi server?")) {
        location.reload();
    }
}
