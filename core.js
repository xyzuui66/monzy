// ==========================================
// CONFIGURATION
// ==========================================
const MASTER_KEY = "Monzyprdc2026";
const SERVER_URL = "http://192.168.1.2:3000";

// ==========================================
// INITIAL LOAD (Persistence Check)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const sessionActive = localStorage.getItem('monzy_auth');
    if (sessionActive === 'true') {
        showDashboard();
        checkServerConnection();
    }
    loadTeamData();
});

// ==========================================
// 1. AUTHENTICATION LOGIC
// ==========================================
function handleLogin() {
    const pass = document.getElementById('login-pass').value;
    if (pass === MASTER_KEY) {
        localStorage.setItem('monzy_auth', 'true');
        showDashboard();
        checkServerConnection();
        writeLog("Access Granted. Persistence Active.");
    } else {
        alert("Incorrect Passcode!");
    }
}

function handleLogout() {
    if(confirm("Logout and clear session?")) {
        localStorage.removeItem('monzy_auth');
        location.reload();
    }
}

function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-console').style.display = 'block';
}

// ==========================================
// 2. SERVER CONNECTION
// ==========================================
async function checkServerConnection() {
    const indicator = document.getElementById('status-indicator');
    try {
        const res = await fetch(`${SERVER_URL}/api/check-persistence/health`, {
            headers: { "x-monzy-key": MASTER_KEY }
        });
        if (res.ok) {
            indicator.innerText = "STATUS: SERVER ONLINE (SECURE)";
            indicator.className = "status-box online";
            writeLog("Connection to Termux established.");
        } else {
            throw new Error();
        }
    } catch (e) {
        indicator.innerText = "STATUS: SERVER OFFLINE";
        indicator.className = "status-box offline";
        writeLog("Connection failed. Check Termux & WiFi.");
    }
}

// ==========================================
// 3. REMOTE CODE EDITOR
// ==========================================
async function sendCodeUpdate() {
    const fileName = document.getElementById('edit-filename').value;
    const newCode = document.getElementById('edit-content').value;

    if(!fileName || !newCode) return alert("Fill all fields!");

    try {
        writeLog(`Pushing update to ${fileName}...`);
        const res = await fetch(`${SERVER_URL}/api/update-code`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-monzy-key": MASTER_KEY
            },
            body: JSON.stringify({ fileName, newCode })
        });
        const data = await res.json();
        if(res.ok) {
            alert(data.message);
            writeLog(`[SUCCESS] ${fileName} updated on server.`);
        } else {
            alert("Update failed: " + data.error);
        }
    } catch (e) {
        alert("Error connecting to editor endpoint.");
    }
}

// ==========================================
// 4. TEAM MANAGEMENT (Persistent Storage)
// ==========================================
let teamData = JSON.parse(localStorage.getItem('monzy_team_list')) || [
    { name: "Monzy (Owner)", role: "Creator" }
];

function loadTeamData() {
    const container = document.getElementById('team-list-display');
    if(!container) return;
    container.innerHTML = teamData.map((m, i) => `
        <div class="team-item">
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
