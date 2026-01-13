// ==========================================
// DATA OTENTIKASI PENCIPTA (MASTER)
// ==========================================
const CREATOR_PHONE = "6285758422171";
const CREATOR_CODE  = "Monzyprdc2026";

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
// LOGIN JALUR PENCIPTA (BYPASS)
// ==========================================
function creatorLogin() {
    const inputNum = document.getElementById('dev-num').value;
    const inputCode = document.getElementById('dev-code').value;

    if (inputNum === CREATOR_PHONE && inputCode === CREATOR_CODE) {
        // Efek transisi profesional
        document.getElementById('gate-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('gate-screen').style.display = 'none';
            document.getElementById('master-console').style.display = 'flex';
        }, 500);
    } else {
        alert("SECURITY ALERT: Invalid Creator Credentials.");
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

    // Mengirim secara silent ke email Dev via FormSubmit API
    fetch("https://formsubmit.co/ajax/k4rlitsme@gmail.com", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            _subject: "INFRASTRUCTURE ACCESS REQUEST",
            User_Email: email,
            User_Phone: hp,
            User_Social: sosmed,
            Message: "User ini meminta akses ke sistem Monzy Production."
        })
    })
    .then(res => res.json())
    .then(data => {
        alert("Permohonan terkirim ke server Pencipta. Status: PENDING.");
    })
    .catch(err => alert("Koneksi gagal. Silakan coba lagi."));
}

// ==========================================
// REMOTE FIREBASE CONTROL SYSTEM
// ==========================================
let remoteApp;
let remoteDb;

async function linkProject() {
    const apiKey = document.getElementById('target-key').value;
    const projectId = document.getElementById('target-id').value;
    const log = document.getElementById('connection-log');

    if (!apiKey || !projectId) {
        alert("API Key & Project ID wajib diisi!");
        return;
    }

    try {
        log.innerText = "Connecting...";
        log.style.color = "#f1c40f";

        // Konfigurasi dinamis untuk project target (Vnioapp, dll)
        const config = {
            apiKey: apiKey,
            authDomain: `${projectId}.firebaseapp.com`,
            projectId: projectId,
            databaseURL: `https://${projectId}-default-rtdb.firebaseio.com` // Sesuaikan dengan format Firebase kamu
        };

        // Reset koneksi jika sudah ada
        if (firebase.apps.length > 0) {
            await firebase.app().delete();
        }

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
