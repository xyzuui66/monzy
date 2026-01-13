// ==========================================
// DATA OTENTIKASI PENCIPTA (MASTER)
// ==========================================
const CREATOR_PHONE = "6285758422171";
const CREATOR_CODE  = "Monzyprdc2026";
const SERVER_IP     = "192.168.1.2:3000"; // IP Termux

// ==========================================
// SISTEM PERSISTENCE (ANTI-REFRESH) [cite: 2025-12-30]
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem('monzy_auth_session');
    if (session === 'active') {
        // Jika sudah login, langsung bypass ke dashboard
        document.getElementById('gate-screen').style.display = 'none';
        document.getElementById('master-console').style.display = 'flex';
        checkTermuxConnection(); // Cek koneksi termux otomatis
    }
});

// ==========================================
// SISTEM NAVIGASI TAB (LOGIN)
// ==========================================
function switchTab(type) {
    const viewReq = document.getElementById('view-request');
    const viewDev = document.getElementById('view-dev');
    const tabReq  = document.getElementById('tab-request');
    const tabDev  = document.getElementById('tab-dev');

    if (type === 'request') {
        viewReq.style.display = 'block';
        viewDev.style.display = 'none';
        tabReq.classList.add('active');
        tabDev.classList.remove('active');
    } else {
        viewReq.style.display = 'none';
        viewDev.style.display = 'block';
        tabReq.classList.remove('active');
        tabDev.classList.add('active');
    }
}

// ==========================================
// LOGIN JALUR PENCIPTA (BYPASS & PERSIST)
// ==========================================
function creatorLogin() {
    const inputNum = document.getElementById('dev-num').value;
    const inputCode = document.getElementById('dev-code').value;

    if (inputNum === CREATOR_PHONE && inputCode === CREATOR_CODE) {
        // Simpan Sesi agar tidak hilang saat refresh [cite: 2025-12-30]
        localStorage.setItem('monzy_auth_session', 'active');

        // Efek transisi profesional
        const gate = document.getElementById('gate-screen');
        gate.style.transition = '0.5s';
        gate.style.opacity = '0';
        
        setTimeout(() => {
            gate.style.display = 'none';
            document.getElementById('master-console').style.display = 'flex';
            checkTermuxConnection();
        }, 500);
    } else {
        alert("SECURITY ALERT: Invalid Creator Credentials.");
    }
}

// ==========================================
// REMOTE CODE EDITOR (TERMUX INTEGRATION)
// ==========================================
async function updateRemoteCode() {
    const fileName = document.getElementById('edit-file-name').value;
    const newCode = document.getElementById('edit-code-area').value;

    if (!fileName || !newCode) return alert("File/Kode tidak boleh kosong!");

    try {
        const response = await fetch(`http://${SERVER_IP}/api/update-code`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-monzy-key": CREATOR_CODE
            },
            body: JSON.stringify({ fileName, newCode })
        });

        const result = await response.json();
        alert(result.status === "Success" ? "Code Updated Real-time!" : "Error: " + result.error);
    } catch (err) {
        alert("Gagal koneksi ke Termux! Pastikan server jalan.");
    }
}

async function checkTermuxConnection() {
    try {
        await fetch(`http://${SERVER_IP}/api/check-persistence/health`, {
            headers: { "x-monzy-key": CREATOR_CODE }
        });
        console.log("Termux Connected.");
    } catch (e) {
        console.log("Termux Offline.");
    }
}

// ==========================================
// KIRIM DATA CALON TIM (OTOMATIS)
// ==========================================
function submitToCreator() {
    const email = document.getElementById('req-email').value;
    const hp = document.getElementById('req-hp').value;
    const sosmed = document.getElementById('req-sosmed').value;

    if (!email || !hp || !sosmed) {
        alert("Harap lengkapi semua field identitas.");
        return;
    }

    fetch("https://formsubmit.co/ajax/k4rlitsme@gmail.com", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            _subject: "INFRASTRUCTURE ACCESS REQUEST",
            User_Email: email,
            User_Phone: hp,
            User_Social: sosmed
        })
    })
    .then(() => alert("Permohonan terkirim! Status: PENDING."))
    .catch(() => alert("Koneksi gagal."));
}

// ==========================================
// REMOTE FIREBASE CONTROL (VNIOAPP)
// ==========================================
let remoteDb;

async function linkProject() {
    const apiKey = document.getElementById('target-key').value;
    const projectId = document.getElementById('target-id').value;
    const log = document.getElementById('connection-log');

    if (!apiKey || !projectId) return alert("Isi API Key & ID!");

    try {
        log.innerText = "Connecting...";
        const config = {
            apiKey: apiKey,
            authDomain: `${projectId}.firebaseapp.com`,
            projectId: projectId,
            databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`
        };

        if (firebase.apps.length > 0) await firebase.app().delete();
        firebase.initializeApp(config);
        remoteDb = firebase.database();

        log.innerText = "Link Active: " + projectId;
        log.style.color = "#2ecc71";

        remoteDb.ref('/').on('value', (snapshot) => {
            document.getElementById('raw-data').innerHTML = `
                <pre style="color: #2ecc71;">// Data Streamed\n${JSON.stringify(snapshot.val(), null, 4)}</pre>
            `;
        });
    } catch (error) {
        log.innerText = "Link Failed.";
        alert("Error: " + error.message);
    }
}

function terminateSession() {
    localStorage.removeItem('monzy_auth_session');
    location.reload();
}
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
