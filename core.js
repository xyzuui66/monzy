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
    }
}

// ==========================================
// 4. TEAM MANAGEMENT (Persistent)
// ==========================================
let teamList = JSON.parse(localStorage.getItem('monzy_team')) || [
    { name: "Monzy (Owner)", role: "Creator" }
];

function renderTeam() {
    const teamContainer = document.getElementById('team-list-output');
    if (!teamContainer) return;

    teamContainer.innerHTML = teamList.map((member, index) => `
        <div class="team-card" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #333;">
            <span><strong>${member.name}</strong> (${member.role})</span>
            ${index !== 0 ? `<button onclick="removeTeamMember(${index})" style="background:red; border:none; color:white; padding:2px 8px; cursor:pointer;">X</button>` : ''}
        </div>
    `).join('');
}

function addTeamMember() {
    const name = document.getElementById('input-team-name').value;
    const role = document.getElementById('input-team-role').value;

    if (name && role) {
        teamList.push({ name: name, role: role });
        localStorage.setItem('monzy_team', JSON.stringify(teamList));
        renderTeam();
        document.getElementById('input-team-name').value = '';
        document.getElementById('input-team-role').value = '';
    }
}

function removeTeamMember(index) {
    teamList.splice(index, 1);
    localStorage.setItem('monzy_team', JSON.stringify(teamList));
    renderTeam();
}
            <div><strong>${m.name}</strong> <small>(${m.role})</small></div>
            ${i !== 0 ? `<button onclick="deleteTeam(${i})" style="width:30px; background:red; color:white; padding:2px;">X</button>` : ''}
        </div>
    `).join('');
}

function addNewTeam() {
    const n = document.getElementById('new-name').value;
    const r = document.getElementById('new-role').value;
    if(n && r) {
        teamData.push({ name: n, role: r });
        localStorage.setItem('monzy_team_list', JSON.stringify(teamData));
        loadTeamData();
        document.getElementById('new-name').value = '';
        document.getElementById('new-role').value = '';
    }
}

function deleteTeam(index) {
    teamData.splice(index, 1);
    localStorage.setItem('monzy_team_list', JSON.stringify(teamData));
    loadTeamData();
}

// ==========================================
// 5. TERMINAL & LOGS
// ==========================================
async function runTerminal() {
    const cmd = document.getElementById('term-cmd').value;
    try {
        writeLog(`Executing: ${cmd}`);
        const res = await fetch(`${SERVER_URL}/api/system/terminal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-monzy-key": MASTER_KEY
            },
            body: JSON.stringify({ command: cmd })
        });
        const data = await res.json();
        writeLog(`Output: ${data.output}`);
    } catch (e) {
        writeLog(`Terminal Error: Failed to execute.`);
    }
}

function writeLog(msg) {
    const win = document.getElementById('log-window');
    const time = new Date().toLocaleTimeString();
    if(win) {
        win.innerHTML += `<br>[${time}] ${msg}`;
        win.scrollTop = win.scrollHeight;
    }
}
