// State Management
const state = {
    currentScreen: 'mainMenu',
    currentStep: 1,
    algorithm: 'default',
    costParameters: [],
    dataLayers: [],
    startPoint: null,
    endPoint: null,
    routes: []
};

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    state.currentScreen = screenId;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeMainMenu();
    initializeTransmissionSetup();
    initializeMapSelection();
    initializeNotification();
    initializePastRoutes();
    loadSampleRoutes();
});

// Main Menu
function initializeMainMenu() {
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            const option = this.getAttribute('data-option');
            if (option === 'transmission') {
                showScreen('transmissionSetup');
                resetSetup();
            } else if (option === 'substation') {
                alert('Substation Siting - Coming Soon!');
            } else if (option === 'custom') {
                alert('Add Your Case - Coming Soon!');
            }
        });
    });

    document.getElementById('viewPastRoutes').addEventListener('click', () => {
        showScreen('pastRoutes');
    });
}

// Transmission Setup
function initializeTransmissionSetup() {
    // Algorithm selection
    document.querySelectorAll('input[name="algorithm"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const customHeuristic = document.getElementById('customHeuristic');
            if (this.value === 'custom') {
                customHeuristic.classList.remove('hidden');
            } else {
                customHeuristic.classList.add('hidden');
            }
            state.algorithm = this.value;
        });
    });

    // Step navigation
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (state.currentStep < 3) {
                goToStep(state.currentStep + 1);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (state.currentStep > 1) {
                goToStep(state.currentStep - 1);
            }
        });
    });

    // Proceed to map
    document.getElementById('proceedToMap').addEventListener('click', () => {
        collectSetupData();
        showScreen('mapSelection');
        initializeCanvas();
    });

    // Back buttons
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', function() {
            const currentScreenElement = this.closest('.screen');
            if (currentScreenElement.id === 'transmissionSetup') {
                showScreen('mainMenu');
            } else if (currentScreenElement.id === 'mapSelection') {
                showScreen('transmissionSetup');
            } else if (currentScreenElement.id === 'pastRoutes') {
                showScreen('mainMenu');
            }
        });
    });
}

function goToStep(stepNumber) {
    // Update progress indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < stepNumber) {
            step.classList.add('completed');
        } else if (index + 1 === stepNumber) {
            step.classList.add('active');
        }
    });

    // Update step content
    document.querySelectorAll('.setup-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step${stepNumber}`).classList.add('active');

    state.currentStep = stepNumber;
}

function resetSetup() {
    state.currentStep = 1;
    goToStep(1);
    state.algorithm = 'default';
    document.querySelector('input[name="algorithm"][value="default"]').checked = true;
    document.getElementById('customHeuristic').classList.add('hidden');
}

function collectSetupData() {
    // Collect cost parameters
    state.costParameters = [];
    document.querySelectorAll('input[name="cost"]:checked').forEach(checkbox => {
        const paramGroup = checkbox.closest('.parameter-group');
        const value = paramGroup.querySelector('.parameter-value').value;
        state.costParameters.push({
            type: checkbox.value,
            value: parseFloat(value)
        });
    });

    // Collect data layers
    state.dataLayers = [];
    document.querySelectorAll('input[name="layer"]:checked').forEach(checkbox => {
        state.dataLayers.push(checkbox.value);
    });
}

// Map Selection
function initializeMapSelection() {
    const canvas = document.getElementById('mapCanvas');
    const resetBtn = document.getElementById('resetPoints');
    const submitBtn = document.getElementById('submitRoute');

    canvas.addEventListener('click', handleMapClick);

    resetBtn.addEventListener('click', () => {
        state.startPoint = null;
        state.endPoint = null;
        updatePointStatus();
        submitBtn.disabled = true;
        drawMap();
    });

    submitBtn.addEventListener('click', () => {
        submitRoute();
    });
}

function initializeCanvas() {
    const canvas = document.getElementById('mapCanvas');
    const map = document.getElementById('map');
    canvas.width = map.offsetWidth;
    canvas.height = map.offsetHeight;
    drawMap();
}

function drawMap() {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw start point
    if (state.startPoint) {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(state.startPoint.x, state.startPoint.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('START', state.startPoint.x - 20, state.startPoint.y - 15);
    }

    // Draw end point
    if (state.endPoint) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(state.endPoint.x, state.endPoint.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('END', state.endPoint.x - 15, state.endPoint.y - 15);
    }

    // Draw line between points if both are set
    if (state.startPoint && state.endPoint) {
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(state.startPoint.x, state.startPoint.y);
        ctx.lineTo(state.endPoint.x, state.endPoint.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function handleMapClick(event) {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!state.startPoint) {
        state.startPoint = { x, y };
    } else if (!state.endPoint) {
        state.endPoint = { x, y };
        document.getElementById('submitRoute').disabled = false;
    }

    updatePointStatus();
    drawMap();
}

function updatePointStatus() {
    const startStatus = document.getElementById('startStatus');
    const endStatus = document.getElementById('endStatus');

    if (state.startPoint) {
        startStatus.textContent = `Start Point: Set (${Math.round(state.startPoint.x)}, ${Math.round(state.startPoint.y)})`;
        startStatus.style.color = '#10b981';
        startStatus.style.fontWeight = '600';
    } else {
        startStatus.textContent = 'Start Point: Not Set';
        startStatus.style.color = '#64748b';
        startStatus.style.fontWeight = 'normal';
    }

    if (state.endPoint) {
        endStatus.textContent = `End Point: Set (${Math.round(state.endPoint.x)}, ${Math.round(state.endPoint.y)})`;
        endStatus.style.color = '#ef4444';
        endStatus.style.fontWeight = '600';
    } else {
        endStatus.textContent = 'End Point: Not Set';
        endStatus.style.color = '#64748b';
        endStatus.style.fontWeight = 'normal';
    }
}

function submitRoute() {
    const submissionId = 'RT-' + Date.now().toString(36).toUpperCase();
    document.getElementById('submissionId').textContent = submissionId;

    // Save route to history
    const newRoute = {
        id: submissionId,
        timestamp: new Date().toISOString(),
        algorithm: state.algorithm,
        startPoint: state.startPoint,
        endPoint: state.endPoint,
        costParameters: state.costParameters,
        dataLayers: state.dataLayers,
        status: 'processing'
    };

    state.routes.unshift(newRoute);
    saveRoutes();

    // Simulate processing - change status after 5 seconds
    setTimeout(() => {
        const route = state.routes.find(r => r.id === submissionId);
        if (route) {
            route.status = 'completed';
            saveRoutes();
        }
    }, 5000);

    showScreen('notification');
}

// Notification
function initializeNotification() {
    document.getElementById('backToMenu').addEventListener('click', () => {
        showScreen('mainMenu');
        resetSelection();
    });

    document.getElementById('viewRoutes').addEventListener('click', () => {
        showScreen('pastRoutes');
        displayRoutes();
    });
}

function resetSelection() {
    state.startPoint = null;
    state.endPoint = null;
    updatePointStatus();
}

// Past Routes
function initializePastRoutes() {
    const searchInput = document.getElementById('searchRoutes');
    const filterSelect = document.getElementById('filterStatus');

    searchInput.addEventListener('input', displayRoutes);
    filterSelect.addEventListener('change', displayRoutes);

    displayRoutes();
}

function displayRoutes() {
    const searchTerm = document.getElementById('searchRoutes').value.toLowerCase();
    const filterStatus = document.getElementById('filterStatus').value;
    const routesList = document.getElementById('routesList');

    let filteredRoutes = state.routes.filter(route => {
        const matchesSearch = route.id.toLowerCase().includes(searchTerm);
        const matchesStatus = filterStatus === 'all' || route.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (filteredRoutes.length === 0) {
        routesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No routes found.</p>';
        return;
    }

    routesList.innerHTML = filteredRoutes.map(route => `
        <div class="route-item">
            <div class="route-header">
                <div class="route-title">${route.id}</div>
                <span class="route-status ${route.status}">${route.status.toUpperCase()}</span>
            </div>
            <div class="route-meta">
                <span>Algorithm: ${route.algorithm === 'default' ? 'Default' : 'Custom Heuristic'}</span>
                <span>Layers: ${route.dataLayers.length}</span>
                <span>${formatDate(route.timestamp)}</span>
            </div>
            <div class="route-actions">
                ${route.status === 'completed' ? '<button onclick="viewRouteDetails(\'' + route.id + '\')">View Details</button>' : ''}
                ${route.status === 'completed' ? '<button onclick="downloadRoute(\'' + route.id + '\')">Download</button>' : ''}
                <button onclick="deleteRoute(\'' + route.id + '\')">Delete</button>
            </div>
        </div>
    `).join('');
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function viewRouteDetails(routeId) {
    const route = state.routes.find(r => r.id === routeId);
    if (route) {
        alert(`Route Details:\n\nID: ${route.id}\nAlgorithm: ${route.algorithm}\nStatus: ${route.status}\nData Layers: ${route.dataLayers.join(', ')}\nCost Parameters: ${route.costParameters.map(p => p.type).join(', ')}`);
    }
}

function downloadRoute(routeId) {
    const route = state.routes.find(r => r.id === routeId);
    if (route) {
        const dataStr = JSON.stringify(route, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${routeId}.json`;
        link.click();
    }
}

function deleteRoute(routeId) {
    if (confirm('Are you sure you want to delete this route?')) {
        state.routes = state.routes.filter(r => r.id !== routeId);
        saveRoutes();
        displayRoutes();
    }
}

// Local Storage
function saveRoutes() {
    localStorage.setItem('transmissionRoutes', JSON.stringify(state.routes));
}

function loadRoutes() {
    const saved = localStorage.getItem('transmissionRoutes');
    if (saved) {
        state.routes = JSON.parse(saved);
    }
}

function loadSampleRoutes() {
    loadRoutes();

    // Add sample routes if none exist
    if (state.routes.length === 0) {
        state.routes = [
            {
                id: 'RT-SAMPLE1',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                algorithm: 'default',
                startPoint: { x: 100, y: 150 },
                endPoint: { x: 400, y: 300 },
                costParameters: [{ type: 'distance', value: 1000 }],
                dataLayers: ['elevation', 'landuse'],
                status: 'completed'
            },
            {
                id: 'RT-SAMPLE2',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                algorithm: 'custom',
                startPoint: { x: 200, y: 100 },
                endPoint: { x: 500, y: 400 },
                costParameters: [{ type: 'distance', value: 1000 }, { type: 'terrain', value: 500 }],
                dataLayers: ['elevation', 'protected', 'infrastructure'],
                status: 'processing'
            }
        ];
        saveRoutes();
    }
}
