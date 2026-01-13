// ==========================================
// CONFIGURATION [cite: 2025-12-30]
// ==========================================
const CREATOR_PHONE = "6285758422171";
const CREATOR_CODE  = "Monzyprdc2026";
const DEV_EMAIL     = "k4rlitsme@gmail.com";

// ==========================================
// INITIALIZER (ANTI-FREEZE LOAD)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("System Initialized...");
    
    // Auto-login persistence
    const session = localStorage.getItem('monzy_auth_session');
    if (session === 'active') {
        const gate = document.getElementById('gate-screen');
        const master = document.getElementById('master-console');
        if (gate && master) {
            gate.style.display = 'none';
            master.style.display = 'flex';
        }
    }
});

// ==========================================
// LOGIN CREATOR (BYPASS)
// ==========================================
function creatorLogin() {
    const num = document.getElementById('dev-num')?.value;
    const code = document.getElementById('dev-code')?.value;

    if (num === CREATOR_PHONE && code === CREATOR_CODE) {
        localStorage.setItem('monzy_auth_session', 'active');
        // Langsung pindah tampilan tanpa reload agar tidak freeze
        const gate = document.getElementById('gate-screen');
        const master = document.getElementById('master-console');
        if (gate && master) {
            gate.style.display = 'none';
            master.style.display = 'flex';
        }
    } else {
        alert("ACCESS DENIED: Credentials Invalid.");
    }
}

// ==========================================
// TEAM LOGIN (SILENT BACKGROUND REQUEST)
// ==========================================
async function teamRequestLogin() {
    const data = {
        user: document.getElementById('t-user')?.value,
        hp: document.getElementById('t-hp')?.value,
        email: document.getElementById('t-email')?.value,
        sosmed: document.getElementById('t-sosmed')?.value
    };

    if (!data.user || !data.hp || !data.email || !data.sosmed) {
        alert("Lengkapi semua data tim!");
        return;
    }

    try {
        // Kirim data secara background tanpa mengganggu UI
        fetch(`https://formsubmit.co/ajax/${DEV_EMAIL}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _subject: "ACCESS REQUEST: " + data.user,
                ...data,
                Note: "User ini meminta akses ke Monzy Production."
            })
        });

        alert("Permohonan dikirim. Tunggu instruksi selanjutnya.");
    } catch (err) {
        alert("Koneksi gagal, tapi data tersimpan di log sistem.");
    }
}

// ==========================================
// TAB SWITCHER (Mencegah Lag)
// ==========================================
function switchLogin(mode) {
    const fDev = document.getElementById('form-dev');
    const fTeam = document.getElementById('form-team');
    const tDev = document.getElementById('tab-dev');
    const tTeam = document.getElementById('tab-team');

    if (!fDev || !fTeam) return;

    if (mode === 'dev') {
        fDev.style.display = 'block';
        fTeam.style.display = 'none';
        if (tDev) tDev.style.borderBottom = "2px solid #38bdf8";
        if (tTeam) tTeam.style.borderBottom = "none";
    } else {
        fDev.style.display = 'none';
        fTeam.style.display = 'block';
        if (tTeam) tTeam.style.borderBottom = "2px solid #38bdf8";
        if (tDev) tDev.style.borderBottom = "none";
    }
}

function terminateSession() {
    localStorage.clear();
    location.reload();
}
        }
    } catch (err) {
        alert("Gagal terhubung. Cek koneksi internet.");
    }
}

// ==========================================
// LOGOUT
// ==========================================
function terminateSession() {
    localStorage.clear();
    location.reload();
}
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
