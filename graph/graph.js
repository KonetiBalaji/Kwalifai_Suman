// --- API & DATA SETUP ---
const API_KEY = '8cae904855af46d8a82e98440b4e88e7'; 

// Series Config
const seriesConfig = [
    // Col 1
    { id: 'OBMMIC30YF', label: '30-Yr. Conforming', col: 1, color: '#333', visible: false },
    { id: 'OBMMIJUMBO30YF', label: '30-Yr. Jumbo', col: 1, color: '#555', visible: false },
    { id: 'OBMMIFHA30YF', label: '30-Yr. FHA', col: 1, color: '#777', visible: false },
    { id: 'OBMMIVA30YF', label: '30-Yr. VA', col: 1, color: '#888', visible: false },
    { id: 'OBMMIUSDA30YF', label: '30-Yr. USDA', col: 1, color: '#999', visible: false },
    { id: 'OBMMIC15YF', label: '15-Yr. Conforming', col: 1, color: '#aaa', visible: false },
    // Col 2
    { id: 'OBMMIC30YFLVLE80FGE740', label: 'FICO > 740', col: 2, color: '#27ae60', visible: false },
    { id: 'OBMMIC30YFLVLE80FB720A739', label: 'FICO 720 - 739', col: 2, color: '#2ecc71', visible: false },
    { id: 'OBMMIC30YFLVLE80FB700A719', label: 'FICO 700 - 719', col: 2, color: '#58d68d', visible: false },
    { id: 'OBMMIC30YFLVLE80FB680A699', label: 'FICO 680 - 699', col: 2, color: '#82e0aa', visible: false },
    { id: 'OBMMIC30YFLVLE80FLT680', label: 'FICO < 680', col: 2, color: '#abebc6', visible: false },
    // Col 3
    { id: 'OBMMIC30YFLVGT80FGE740', label: 'FICO > 740', col: 3, color: '#741b1b', visible: true }, // Default ON
    { id: 'OBMMIC30YFLVGT80FB720A739', label: 'FICO 720 - 739', col: 3, color: '#c0392b', visible: false },
    { id: 'OBMMIC30YFLVGT80FB700A719', label: 'FICO 700 - 719', col: 3, color: '#d98880', visible: false },
    { id: 'OBMMIC30YFLVGT80FB680A699', label: 'FICO 680 - 699', col: 3, color: '#e6b0aa', visible: false },
    { id: 'OBMMIC30YFLVGT80FLT680', label: 'FICO < 680', col: 3, color: '#f2d7d5', visible: false },
];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    createControls();
    initChart();
    setupEventListeners();
    fetchAllData();
});

let chart;

// --- RENDER TOGGLES ---
function createControls() {
    seriesConfig.forEach((item, index) => {
        const html = `
            <label class="toggle-item">
                <input type="checkbox" id="chk-${index}" ${item.visible ? 'checked' : ''} onchange="toggleSeries(${index})">
                <div class="switch"></div>
                <span class="label-text">${item.label}</span>
            </label>
        `;
        document.getElementById(`col${item.col}-controls`).innerHTML += html;
    });
}

// --- CHART SETUP ---
function initChart() {
    const ctx = document.getElementById('ratesChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: { datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'nearest', axis: 'x', intersect: false },
            plugins: { 
                legend: { display: false },
                tooltip: { 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    titleColor: '#333', 
                    bodyColor: '#333', 
                    borderColor: '#ccc', 
                    borderWidth: 1,
                    displayColors: true,
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(3) + '%';
                        }
                    }
                }
            },
            elements: {
                line: { tension: 0, borderWidth: 2 }, 
                point: { radius: 0, hoverRadius: 6, hitRadius: 10 }
            },
            scales: {
                x: { 
                    type: 'time', 
                    time: { unit: 'week', tooltipFormat: 'MMM D, YYYY' },
                    grid: { display: false, drawBorder: false },
                    ticks: { color: '#888', font: { size: 11 } }
                },
                y: { 
                    position: 'left',
                    grid: { color: '#f0f0f0', borderDash: [] },
                    ticks: { callback: (val) => val.toFixed(3) + '%', color: '#888', font: { size: 11 } },
                    border: { display: false }
                }
            }
        }
    });
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Range Buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const range = parseInt(e.target.dataset.range);
            setRange(range, e.target);
        });
    });

    // Custom Date Inputs
    document.getElementById('start-date').addEventListener('change', applyCustomDate);
    document.getElementById('end-date').addEventListener('change', applyCustomDate);

    // Print Button Logic
    document.getElementById('print-btn').addEventListener('click', () => {
        window.print();
    });
}

// --- LOGIC ---
async function fetchAllData() {
    const CORS_PROXY = "https://corsproxy.io/?"; 
    const BASE_URL = "https://api.stlouisfed.org/fred/series/observations";
    const startDate = moment().subtract(5, 'years').format('YYYY-MM-DD'); 

    const fetchPromises = seriesConfig.map(async (series, index) => {
        const url = `${CORS_PROXY}${encodeURIComponent(`${BASE_URL}?series_id=${series.id}&api_key=${API_KEY}&file_type=json&observation_start=${startDate}`)}`; 
        try {
            const response = await fetch(url);
            const json = await response.json();
            if (!json.observations) return null;
            const dataPoints = json.observations.map(obs => ({ x: obs.date, y: parseFloat(obs.value) })).filter(pt => !isNaN(pt.y));
            return {
                label: series.label,
                data: dataPoints,
                borderColor: series.color,
                backgroundColor: series.color,
                hidden: !series.visible
            };
        } catch (err) { return null; }
    });

    const datasets = await Promise.all(fetchPromises);
    chart.data.datasets = datasets.filter(d => d !== null);
    
    // Initial Range: 1 Month
    const defaultBtn = document.querySelector('.tab-btn[data-range="1"]');
    setRange(1, defaultBtn);
}

function setRange(months, btn) {
    if(btn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    
    const end = moment();
    const start = moment().subtract(months, 'months');
    
    updateChart(start, end);

    // Update Date Inputs
    document.getElementById('start-date').value = start.format('YYYY-MM-DD');
    document.getElementById('end-date').value = end.format('YYYY-MM-DD');
}

function applyCustomDate() {
    const startVal = document.getElementById('start-date').value;
    const endVal = document.getElementById('end-date').value;

    if(startVal && endVal) {
        updateChart(moment(startVal), moment(endVal));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    }
}

function updateChart(start, end) {
    chart.options.scales.x.min = start.format('YYYY-MM-DD');
    chart.options.scales.x.max = end.format('YYYY-MM-DD');
    chart.update();
}

// Exposed global function for the HTML onchange attribute (optional if binding via JS)
window.toggleSeries = function(index) {
    const meta = chart.getDatasetMeta(index);
    if(meta) {
        meta.hidden = !document.getElementById(`chk-${index}`).checked;
        chart.update();
    }
}