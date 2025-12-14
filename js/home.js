// ============================================
// HOME.JS - Dashboard Page Scripts
// ============================================

// Load header from external file
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading header:', error));

// Load footer from external file
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));

// ============================================
// BACKEND API CONFIGURATION
// ============================================
const API_BASE_URL = 'http://localhost:3000/api'; // Change this to your backend URL

// Application data storage
let applicationsData = [];
let currentPage = 1;
const itemsPerPage = 5;

// ============================================
// FETCH DATA FROM BACKEND
// ============================================

// Fetch dashboard stats
async function fetchDashboardStats() {
    try {
        // Replace with your actual API endpoint
        const response = await fetch(`${API_BASE_URL}/applications/stats`);
        const data = await response.json();
        
        // Update total applications count
        document.getElementById('totalApplicationsCount').textContent = data.totalApplications || 0;
    } catch (error) {
        console.error('Error fetching stats:', error);
        document.getElementById('totalApplicationsCount').textContent = '0';
    }
}

// Fetch applications list
async function fetchApplications(page = 1) {
    try {
        // Replace with your actual API endpoint
        const response = await fetch(`${API_BASE_URL}/applications?page=${page}&limit=${itemsPerPage}`);
        const data = await response.json();
        
        applicationsData = data.applications || [];
        const totalCount = data.total || 0;
        
        renderApplicationsTable(applicationsData);
        renderPagination(totalCount, page);
        
        // Update showing count
        document.getElementById('showingCount').textContent = applicationsData.length;
        document.getElementById('totalCount').textContent = totalCount;
    } catch (error) {
        console.error('Error fetching applications:', error);
        showEmptyState();
    }
}

// Search application by ID (for track modal)
async function searchApplicationById(appId) {
    try {
        // Replace with your actual API endpoint
        const response = await fetch(`${API_BASE_URL}/applications/${appId}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error searching application:', error);
        return null;
    }
}

// ============================================
// RENDER FUNCTIONS
// ============================================

// Status color mapping
const statusColors = {
    'approved': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    'in progress': { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    'under review': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    'pending': { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
    'rejected': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
};

function renderApplicationsTable(applications) {
    const tbody = document.getElementById('applicationsTableBody');
    const loadingRow = document.getElementById('loadingRow');
    const emptyRow = document.getElementById('emptyRow');
    
    // Hide loading
    loadingRow.classList.add('hidden');
    
    if (!applications || applications.length === 0) {
        emptyRow.classList.remove('hidden');
        return;
    }
    
    emptyRow.classList.add('hidden');
    
    // Clear existing rows (except loading and empty)
    const existingRows = tbody.querySelectorAll('tr:not(#loadingRow):not(#emptyRow)');
    existingRows.forEach(row => row.remove());
    
    // Add application rows
    applications.forEach(app => {
        const statusKey = (app.status || 'pending').toLowerCase();
        const colors = statusColors[statusKey] || statusColors['pending'];
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-blue-50/50 transition-colors';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-navy-dark font-semibold">#${app.applicationId || app.id}</span>
            </td>
            <td class="px-6 py-4">
                <span class="text-gray-800 font-medium">${app.title}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-gray-500">${formatDate(app.dateFiled || app.createdAt)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}">
                    <span class="w-2 h-2 ${colors.dot} rounded-full mr-2"></span>
                    ${app.status}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <button onclick="viewApplication('${app.applicationId || app.id}')" class="text-navy-dark hover:text-white hover:bg-navy-dark px-3 py-1.5 rounded-lg font-medium text-sm transition border border-navy-dark">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderPagination(total, currentPage) {
    const container = document.getElementById('paginationButtons');
    const totalPages = Math.ceil(total / itemsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = `
        <button onclick="goToPage(${currentPage - 1})" class="px-3 py-2 rounded-lg border border-gray-200 text-gray-${currentPage === 1 ? '400' : '600'} hover:bg-gray-100 transition ${currentPage === 1 ? 'disabled:opacity-50 cursor-not-allowed' : ''}" ${currentPage === 1 ? 'disabled' : ''}>
            <span class="material-symbols-outlined text-lg">chevron_left</span>
        </button>
    `;
    
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        if (i === currentPage) {
            html += `<button class="px-4 py-2 rounded-lg bg-navy-dark text-white font-semibold text-sm">${i}</button>`;
        } else {
            html += `<button onclick="goToPage(${i})" class="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition font-medium text-sm">${i}</button>`;
        }
    }
    
    html += `
        <button onclick="goToPage(${currentPage + 1})" class="px-3 py-2 rounded-lg border border-gray-200 text-gray-${currentPage === totalPages ? '400' : '600'} hover:bg-gray-100 transition ${currentPage === totalPages ? 'disabled:opacity-50 cursor-not-allowed' : ''}" ${currentPage === totalPages ? 'disabled' : ''}>
            <span class="material-symbols-outlined text-lg">chevron_right</span>
        </button>
    `;
    
    container.innerHTML = html;
}

function showEmptyState() {
    document.getElementById('loadingRow').classList.add('hidden');
    document.getElementById('emptyRow').classList.remove('hidden');
    document.getElementById('showingCount').textContent = '0';
    document.getElementById('totalCount').textContent = '0';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function goToPage(page) {
    currentPage = page;
    fetchApplications(page);
}

function viewApplication(appId) {
    // Navigate to application details page
    window.location.href = `application_details.html?id=${appId}`;
}

// ============================================
// TRACK APPLICATION MODAL FUNCTIONS
// ============================================
function openTrackModal() {
    const modal = document.getElementById('trackModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('trackAppId').focus();
    // Reset previous results
    document.getElementById('searchResult').classList.add('hidden');
    document.getElementById('notFoundResult').classList.add('hidden');
    document.getElementById('trackAppId').value = '';
}

function closeTrackModal() {
    const modal = document.getElementById('trackModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function searchApplication(e) {
    e.preventDefault();
    const appId = document.getElementById('trackAppId').value.trim().toUpperCase();
    const searchId = appId.startsWith('#') ? appId.substring(1) : appId;
    
    const searchResult = document.getElementById('searchResult');
    const notFoundResult = document.getElementById('notFoundResult');
    
    // Show loading state
    searchResult.classList.add('hidden');
    notFoundResult.classList.add('hidden');
    
    // Call backend API to search
    searchApplicationById(searchId).then(app => {
        if (app) {
            document.getElementById('resultAppId').textContent = '#' + (app.applicationId || app.id);
            document.getElementById('resultTitle').textContent = app.title;
            document.getElementById('resultDate').textContent = formatDate(app.dateFiled || app.createdAt);
            document.getElementById('resultUpdated').textContent = formatDate(app.updatedAt);
            
            const statusKey = (app.status || 'pending').toLowerCase();
            const colors = statusColors[statusKey] || statusColors['pending'];
            
            const statusEl = document.getElementById('resultStatus');
            statusEl.textContent = app.status;
            statusEl.className = `inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`;
            
            searchResult.classList.remove('hidden');
            notFoundResult.classList.add('hidden');
        } else {
            searchResult.classList.add('hidden');
            notFoundResult.classList.remove('hidden');
        }
    });
}

// Close modal on backdrop click
document.getElementById('trackModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeTrackModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeTrackModal();
    }
});

// ============================================
// INITIALIZE PAGE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Fetch data from backend
    fetchDashboardStats();
    fetchApplications(1);
});
