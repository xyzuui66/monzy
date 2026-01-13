// ==========================================
// CONFIGURATION
// ==========================================
const MASTER_KEY = "Monzyprdc2026";
const SERVER_IP = "192.168.1.2";
const SERVER_PORT = "3000";

// ==========================================
// 1. PERSISTENCE LOGIN (Anti-Refresh)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Cek apakah user sudah login sebelumnya [cite: 2025-12-30]
    const session = localStorage.getItem('monzy_session');
    if (session === 'active') {
        showMainDashboard();
        checkServerConnection();
    }
    renderTeam();
});

function creatorLogin() {
    const code = document.getElementById('dev-code').value;

    if (code === MASTER_KEY) {
        localStorage.setItem('monzy_session', 'active');
        showMainDashboard();
        checkServerConnection();
    } else {
        alert("Akses Ditolak: Kode Salah!");
    }
}

function showMainDashboard() {
    document.getElementById('gate-screen').classList.add('hidden');
    document.getElementById('master-console').classList.remove('hidden');
}

function creatorLogout() {
    localStorage.removeItem('monzy_session');
    location.reload();
}

// ==========================================
// 2. SERVER CONNECTION
// ==========================================
async function checkServerConnection() {
    const statusLabel = document.getElementById('server-status');
    try {
        const response = await fetch(`http://${SERVER_IP}:${SERVER_PORT}/api/check-persistence/health`, {
            method: "GET",
            headers: { "x-monzy-key": MASTER_KEY }
        });

        if (response.ok) {
            statusLabel.innerHTML = "<span style='color:#00ff41;'>ONLINE</span>";
        } else {
            statusLabel.innerHTML = "<span style='color:orange;'>UNAUTHORIZED</span>";
        }
    } catch (err) {
        statusLabel.innerHTML = "<span style='color:red;'>OFFLINE</span>";
    }
}

// ==========================================
// 3. REMOTE CODE EDITOR (Real-time Update)
// ==========================================
async function updateRemoteCode() {
    const fileName = document.getElementById('edit-file-name').value;
    const newCode = document.getElementById('edit-code-area').value;
    const log = document.getElementById('log-output');

    if (!fileName || !newCode) return alert("Isi nama file dan kodenya!");

    try {
        log.innerHTML += `<br>> Mengirim update ke ${fileName}...`;
        const response = await fetch(`http://${SERVER_IP}:${SERVER_PORT}/api/update-code`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-monzy-key": MASTER_KEY
            },
            body: JSON.stringify({ fileName, newCode })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            log.innerHTML += `<br>> [SUCCESS] ${fileName} berhasil diupdate!`;
        } else {
            alert("Error: " + result.error);
        }
    } catch (err) {
        alert("Gagal terhubung ke server Termux!");
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
