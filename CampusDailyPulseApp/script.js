/**
 * CAMPUS DAILY PULSE - CORE ENGINE
 * Logic for Dynamic View Switching & Data Visualization
 */

const DATA_STORE = {
    attendance: [
        { class: "CS-101", total: 50, present: 48, status: "High" },
        { class: "ME-202", total: 45, present: 32, status: "Low" },
        { class: "BA-301", total: 60, present: 58, status: "High" },
    ],
    staff: [
        { name: "Dr. Aris Thorne", dept: "Physics", status: "On-Duty", avatar: "1" },
        { name: "Prof. Clara Bell", dept: "Math", status: "On-Leave", avatar: "2" },
        { name: "Dr. Julian Voss", dept: "Chemistry", status: "On-Duty", avatar: "3" },
    ],
    exams: [
        { subject: "Advanced AI", avg: 88, top: "Mark Z.", trend: "up" },
        { subject: "Quantum Mechanics", avg: 72, top: "Elon M.", trend: "down" },
        { subject: "Macro Economics", avg: 81, top: "Steve J.", trend: "stable" }
    ],
    events: [
        { time: "09:00 AM", title: "Faculty Morning Brief", loc: "Conference Hall" },
        { time: "11:30 AM", title: "Google Cloud Seminar", loc: "Auditorium" },
        { time: "03:00 PM", title: "Inter-College Cricket", loc: "Sports Ground" }
    ]
};

const VIEW_TEMPLATES = {
    dashboard: `
        <div class="grid">
            <div class="card stat-card">
                <p style="color:var(--text-muted)">Total Students</p>
                <h2 style="font-size:2rem; margin:10px 0">1,240</h2>
                <span class="badge success">+12 New</span>
            </div>
            <div class="card stat-card">
                <p style="color:var(--text-muted)">Daily Attendance</p>
                <h2 style="font-size:2rem; margin:10px 0">94.2%</h2>
                <span class="badge warning">Check Class ME-202</span>
            </div>
            <div class="card stat-card">
                <p style="color:var(--text-muted)">Staff Present</p>
                <h2 style="font-size:2rem; margin:10px 0">138/142</h2>
                <span class="badge success">Optimal</span>
            </div>
            <div class="card stat-card">
                <p style="color:var(--text-muted)">Fees Collected</p>
                <h2 style="font-size:2rem; margin:10px 0">$42.5k</h2>
                <span class="badge success">Target 80% Meta</span>
            </div>

            <div class="card span-2">
                <h4>Monthly Attendance Trend</h4>
                <div style="height:250px"><canvas id="mainChart"></canvas></div>
            </div>
            <div class="card span-2">
                <h4>Today's Timeline</h4>
                <div class="timeline" style="margin-top:20px">
                    ${DATA_STORE.events.map(e => `
                        <div class="timeline-event">
                            <strong>${e.time}</strong> - ${e.title}
                            <p style="font-size:0.8rem; color:var(--text-muted)">${e.loc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `,
    attendance: `
        <div class="card span-4">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
                <h3>Departmental Attendance</h3>
                <button class="nav-link active" style="padding:8px 15px">Download Report</button>
            </div>
            <table>
                <thead><tr><th>Batch Code</th><th>Students</th><th>Present</th><th>Absentees</th><th>Performance</th></tr></thead>
                <tbody>
                    ${DATA_STORE.attendance.map(a => `
                        <tr>
                            <td><strong>${a.class}</strong></td>
                            <td>${a.total}</td>
                            <td>${a.present}</td>
                            <td>${a.total - a.present}</td>
                            <td><span class="badge ${a.status === 'High' ? 'success' : 'danger'}">${a.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `,
    fees: `
        <div class="grid">
            <div class="card span-2">
                <h3>Financial Progress</h3>
                <div style="height:250px; margin-top:20px"><canvas id="feeChart"></canvas></div>
            </div>
            <div class="card span-2">
                <h3>Fee Alerts</h3>
                <div class="alert-item" style="padding:15px; background:#fff5f5; border-radius:10px; margin-bottom:10px">
                    <strong>Pending Grade 10:</strong> 12 Students overdue for Semester 2.
                </div>
                <div class="alert-item" style="padding:15px; background:#f0fff4; border-radius:10px">
                    <strong>Early Bird:</strong> 45 Students paid Semester 3 in advance.
                </div>
            </div>
        </div>
    `,
    exams: `
        <div class="card span-4">
            <h3>Mid-Term Exam Summary</h3>
            <table>
                <thead><tr><th>Subject</th><th>Class Average</th><th>Top Scorer</th><th>Comparison</th></tr></thead>
                <tbody>
                    ${DATA_STORE.exams.map(e => `
                        <tr>
                            <td>${e.subject}</td>
                            <td>${e.avg}%</td>
                            <td>${e.top}</td>
                            <td><i class="fas fa-arrow-${e.trend}" style="color:${e.trend === 'up' ? 'green' : 'red'}"></i></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `,
    staff: `
        <div class="grid">
            ${DATA_STORE.staff.map(s => `
                <div class="card" style="text-align:center">
                    <img src="https://ui-avatars.com/api/?name=${s.name}&background=random" style="width:60px; border-radius:50%; margin-bottom:15px">
                    <h4>${s.name}</h4>
                    <p style="color:var(--text-muted); font-size:0.8rem">${s.dept}</p>
                    <div style="margin-top:10px" class="badge ${s.status === 'On-Duty' ? 'success' : 'warning'}">${s.status}</div>
                </div>
            `).join('')}
        </div>
    `,
    events: `
        <div class="card span-4">
            <h3>Campus Calendar 2026</h3>
            <p style="color:var(--text-muted); margin-bottom:20px">List of upcoming events for the next 7 days.</p>
            <div class="timeline">
                <div class="timeline-event"><strong>March 15</strong> - Annual Sports Day Inauguration</div>
                <div class="timeline-event"><strong>March 18</strong> - Guest Lecture by Satya Nadella (Virtual)</div>
                <div class="timeline-event"><strong>March 20</strong> - Semester End Break Begins</div>
            </div>
        </div>
    `,
    alerts: `
        <div class="card span-4">
            <h3>System Notifications</h3>
            <div style="border-left:4px solid #ee5d50; padding:15px; background:#fff5f5; margin-bottom:15px">
                <strong>[URGENT]</strong> Backup Server Down: Digital Library access might be limited for 2 hours.
            </div>
            <div style="border-left:4px solid #4361ee; padding:15px; background:#f4f7fe; margin-bottom:15px">
                <strong>[INFO]</strong> New staff onboarding scheduled for Dr. Emily Watson tomorrow at 10 AM.
            </div>
        </div>
    `
};

// CONTROLLER LOGIC
const Controller = {
    init() {
        this.renderView('dashboard');
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Nav Switching
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = link.getAttribute('data-view');
                
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                this.renderView(view);
            });
        });

        // Mobile Toggle
        document.getElementById('mobile-toggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });
    },

    renderView(viewId) {
        const container = document.getElementById('content-area');
        const title = document.getElementById('view-title');
        
        container.innerHTML = VIEW_TEMPLATES[viewId];
        title.innerText = viewId.charAt(0).toUpperCase() + viewId.slice(1);

        // Chart Inits
        if(viewId === 'dashboard') this.initDashboardChart();
        if(viewId === 'fees') this.initFeeChart();
    },

    initDashboardChart() {
        const ctx = document.getElementById('mainChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [{
                    label: 'Campus Attendance %',
                    data: [92, 94, 91, 95, 94],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    },

    initFeeChart() {
        const ctx = document.getElementById('feeChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Collected', 'Pending', 'Scholarships'],
                datasets: [{
                    data: [75, 15, 10],
                    backgroundColor: ['#4361ee', '#ee5d50', '#05cd99'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => Controller.init());