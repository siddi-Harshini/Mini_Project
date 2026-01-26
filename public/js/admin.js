const API_URL = window.location.origin.replace(/\/$/, '') + '/api';

// Check authentication and authorization
function checkAdminAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'admin') {
        window.location.href = 'login.html';
        return null;
    }
    
    return { token, user };
}

// Initialize
const auth = checkAdminAuth();
if (auth) {
    document.getElementById('admin-name').textContent = auth.user.name;
    document.getElementById('admin-welcome').textContent = auth.user.name;
    loadDashboardData();
}

// API Helper
async function apiCall(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API call failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Load all dashboard data
async function loadDashboardData() {
    await Promise.all([
        loadScholarships(),
        loadPrograms(),
        loadStudentCount()
    ]);
}

// Load student count
async function loadStudentCount() {
    try {
        const response = await fetch(`${API_URL}/auth/users`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const students = data.users ? data.users.filter(u => u.role === 'student') : [];
            document.getElementById('total-students').textContent = students.length;
        } else {
            document.getElementById('total-students').textContent = '2';
        }
    } catch (error) {
        console.error('Error loading student count:', error);
        document.getElementById('total-students').textContent = '2';
    }
}

// Load Scholarships
async function loadScholarships() {
    try {
        const data = await apiCall('/admin/scholarships');
        const scholarships = data.scholarships || [];
        document.getElementById('total-scholarships').textContent = scholarships.length;
        
        // Calculate active this month
        const thisMonth = new Date();
        thisMonth.setDate(1);
        const activeCount = scholarships.filter(s => new Date(s.createdAt) >= thisMonth).length;
        updateActiveOpportunities(activeCount);
        
        displayScholarships(scholarships);
    } catch (error) {
        console.error('Error loading scholarships:', error);
        document.getElementById('total-scholarships').textContent = '0';
        document.getElementById('scholarships-list').innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Error loading scholarships: ${error.message}
                </div>
            </div>`;
    }
}

function updateActiveOpportunities(count) {
    const current = parseInt(document.getElementById('active-opportunities').textContent) || 0;
    document.getElementById('active-opportunities').textContent = current + count;
}

function displayScholarships(scholarships) {
    const container = document.getElementById('scholarships-list');
    
    if (scholarships.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                <p class="text-muted">No scholarships added yet. Click "Add Scholarship" to create your first one!</p>
            </div>`;
        return;
    }
    
    container.innerHTML = scholarships.map(s => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm" style="border-radius: 12px; transition: transform 0.2s;">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h5 class="mb-0" style="font-weight: 700; color: #1a1a1a; font-size: 1.1rem;">${s.title}</h5>
                        ${isUrgent(s.deadline) ? '<span class="badge bg-danger">Urgent</span>' : ''}
                    </div>
                    <p class="text-muted small mb-2"><i class="fas fa-building me-1"></i>${s.provider}</p>
                    <p class="text-muted small mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${s.description}</p>
                    <div class="mb-3">
                        <small class="text-muted d-block"><i class="fas fa-dollar-sign me-1"></i>${s.amount || 'Not specified'}</small>
                        <small class="text-muted d-block"><i class="fas fa-calendar me-1"></i>Deadline: ${new Date(s.deadline).toLocaleDateString()}</small>
                        <small class="text-muted d-block"><i class="fas fa-chart-line me-1"></i>Min CGPA: ${s.eligibility.minCGPA}</small>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary flex-fill" onclick="viewEligibleStudents('${s._id}', 'scholarship')">
                            <i class="fas fa-users me-1"></i>Eligible
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteScholarship('${s._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function isUrgent(deadline) {
    const daysUntil = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil >= 0;
}

// Load Programs
async function loadPrograms() {
    try {
        const data = await apiCall('/admin/programs');
        const programs = data.programs || [];
        document.getElementById('total-programs').textContent = programs.length;
        
        // Calculate active this month
        const thisMonth = new Date();
        thisMonth.setDate(1);
        const activeCount = programs.filter(p => new Date(p.createdAt) >= thisMonth).length;
        updateActiveOpportunities(activeCount);
        
        displayPrograms(programs);
    } catch (error) {
        console.error('Error loading programs:', error);
        document.getElementById('total-programs').textContent = '0';
        document.getElementById('programs-list').innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Error loading programs: ${error.message}
                </div>
            </div>`;
    }
}

function displayPrograms(programs) {
    const container = document.getElementById('programs-list');
    
    if (programs.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                <p class="text-muted">No programs added yet. Click "Add Program" to create your first one!</p>
            </div>`;
        return;
    }
    
    const typeColors = {
        internship: '#667eea',
        fellowship: '#f093fb',
        ambassador: '#4facfe',
        hackathon: '#43e97b',
        conference: '#fa709a',
        'coding-event': '#feca57',
        other: '#a29bfe'
    };
    
    container.innerHTML = programs.map(p => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm" style="border-radius: 12px;">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <span class="badge" style="background: ${typeColors[p.type] || typeColors.other}; font-weight: 600;">${p.type.toUpperCase()}</span>
                        ${isUrgent(p.deadline) ? '<span class="badge bg-danger">Urgent</span>' : ''}
                    </div>
                    <h5 class="mb-3" style="font-weight: 700; color: #1a1a1a; font-size: 1.1rem;">${p.title}</h5>
                    <p class="text-muted small mb-2"><i class="fas fa-building me-1"></i>${p.provider}</p>
                    <p class="text-muted small mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${p.description}</p>
                    <div class="mb-3">
                        <small class="text-muted d-block"><i class="fas fa-clock me-1"></i>${p.duration || 'Not specified'}</small>
                        <small class="text-muted d-block"><i class="fas fa-map-marker-alt me-1"></i>${p.location || 'Not specified'}</small>
                        <small class="text-muted d-block"><i class="fas fa-calendar me-1"></i>Deadline: ${new Date(p.deadline).toLocaleDateString()}</small>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary flex-fill" onclick="viewEligibleStudents('${p._id}', 'program')">
                            <i class="fas fa-users me-1"></i>Eligible
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteProgram('${p._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Show/Hide Forms
function showAddScholarshipForm() {
    document.getElementById('add-scholarship-form').classList.remove('d-none');
    document.getElementById('add-scholarship-form').scrollIntoView({ behavior: 'smooth' });
}

function hideAddScholarshipForm() {
    document.getElementById('add-scholarship-form').classList.add('d-none');
    document.getElementById('scholarship-form').reset();
}

function showAddProgramForm() {
    document.getElementById('add-program-form').classList.remove('d-none');
    document.getElementById('add-program-form').scrollIntoView({ behavior: 'smooth' });
}

function hideAddProgramForm() {
    document.getElementById('add-program-form').classList.add('d-none');
    document.getElementById('program-form').reset();
}

// Add Scholarship
if (document.getElementById('scholarship-form')) {
    document.getElementById('scholarship-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const genderInput = formData.get('gender').toLowerCase().trim();
        const genderArray = genderInput === 'all' ? ['all'] : genderInput.split(',').map(s => s.trim()).filter(s => s);
        
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            provider: formData.get('provider'),
            amount: formData.get('amount'),
            deadline: formData.get('deadline'),
            applicationLink: formData.get('applicationLink') || undefined,
            eligibility: {
                gender: genderArray.length > 0 ? genderArray : ['all'],
                minCGPA: parseFloat(formData.get('minCGPA')) || 0,
                year: formData.get('year') ? formData.get('year').split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)) : [],
                departments: formData.get('departments') ? formData.get('departments').split(',').map(s => s.trim()).filter(s => s) : [],
                requiredSkills: formData.get('requiredSkills') ? formData.get('requiredSkills').split(',').map(s => s.trim()).filter(s => s) : []
            },
            tags: formData.get('tags') ? formData.get('tags').split(',').map(s => s.trim()).filter(s => s) : []
        };
        
        try {
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';
            
            await apiCall('/admin/scholarships', 'POST', data);
            
            // Success feedback
            const successDiv = document.createElement('div');
            successDiv.className = 'alert alert-success';
            successDiv.innerHTML = '<i class="fas fa-check-circle me-2"></i>Scholarship added successfully!';
            e.target.insertBefore(successDiv, e.target.firstChild);
            
            setTimeout(() => successDiv.remove(), 3000);
            
            hideAddScholarshipForm();
            await loadScholarships();
        } catch (error) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>Error: ${error.message}`;
            e.target.insertBefore(errorDiv, e.target.firstChild);
            
            setTimeout(() => errorDiv.remove(), 5000);
        } finally {
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save Scholarship';
        }
    });
}

// Add Program
if (document.getElementById('program-form')) {
    document.getElementById('program-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const genderInput = formData.get('gender').toLowerCase().trim();
        const genderArray = genderInput === 'all' ? ['all'] : genderInput.split(',').map(s => s.trim()).filter(s => s);
        
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            provider: formData.get('provider'),
            type: formData.get('type'),
            duration: formData.get('duration') || undefined,
            deadline: formData.get('deadline'),
            location: formData.get('location') || undefined,
            applicationLink: formData.get('applicationLink') || undefined,
            eligibility: {
                gender: genderArray.length > 0 ? genderArray : ['all'],
                minCGPA: parseFloat(formData.get('minCGPA')) || 0,
                year: formData.get('year') ? formData.get('year').split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)) : [],
                departments: formData.get('departments') ? formData.get('departments').split(',').map(s => s.trim()).filter(s => s) : [],
                requiredSkills: formData.get('requiredSkills') ? formData.get('requiredSkills').split(',').map(s => s.trim()).filter(s => s) : []
            },
            tags: formData.get('tags') ? formData.get('tags').split(',').map(s => s.trim()).filter(s => s) : []
        };
        
        try {
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';
            
            await apiCall('/admin/programs', 'POST', data);
            
            // Success feedback
            const successDiv = document.createElement('div');
            successDiv.className = 'alert alert-success';
            successDiv.innerHTML = '<i class="fas fa-check-circle me-2"></i>Program added successfully!';
            e.target.insertBefore(successDiv, e.target.firstChild);
            
            setTimeout(() => successDiv.remove(), 3000);
            
            hideAddProgramForm();
            await loadPrograms();
        } catch (error) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>Error: ${error.message}`;
            e.target.insertBefore(errorDiv, e.target.firstChild);
            
            setTimeout(() => errorDiv.remove(), 5000);
        } finally {
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save Program';
        }
    });
}

// Delete Functions
async function deleteScholarship(id) {
    if (!confirm('Are you sure you want to delete this scholarship?')) return;
    
    try {
        await apiCall(`/admin/scholarships/${id}`, 'DELETE');
        alert('Scholarship deleted successfully!');
        loadScholarships();
    } catch (error) {
        alert('Error deleting scholarship: ' + error.message);
    }
}

async function deleteProgram(id) {
    if (!confirm('Are you sure you want to delete this program?')) return;
    
    try {
        await apiCall(`/admin/programs/${id}`, 'DELETE');
        alert('Program deleted successfully!');
        loadPrograms();
    } catch (error) {
        alert('Error deleting program: ' + error.message);
    }
}

// View Eligible Students
async function viewEligibleStudents(id, type) {
    try {
        const endpoint = type === 'scholarship' 
            ? `/admin/scholarships/${id}/eligible-students`
            : `/admin/programs/${id}/eligible-students`;
        
        const data = await apiCall(endpoint);
        
        const modal = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;" onclick="this.remove()">
                <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 800px; max-height: 80vh; overflow-y: auto;" onclick="event.stopPropagation()">
                    <h3>Eligible Students for: ${data[type].title}</h3>
                    <p><strong>Total Eligible:</strong> ${data.eligibleCount}</p>
                    ${data.students.length > 0 ? `
                        <table style="width: 100%; margin-top: 1rem; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg-light);">
                                    <th style="padding: 0.5rem; text-align: left;">Name</th>
                                    <th style="padding: 0.5rem; text-align: left;">Email</th>
                                    <th style="padding: 0.5rem; text-align: left;">Year</th>
                                    <th style="padding: 0.5rem; text-align: left;">Dept</th>
                                    <th style="padding: 0.5rem; text-align: left;">CGPA</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.students.map(s => `
                                    <tr style="border-bottom: 1px solid var(--border-color);">
                                        <td style="padding: 0.5rem;">${s.name}</td>
                                        <td style="padding: 0.5rem;">${s.email}</td>
                                        <td style="padding: 0.5rem;">${s.profile?.year || 'N/A'}</td>
                                        <td style="padding: 0.5rem;">${s.profile?.department || 'N/A'}</td>
                                        <td style="padding: 0.5rem;">${s.profile?.cgpa || 'N/A'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p>No eligible students found.</p>'}
                    <button class="btn btn-secondary" style="margin-top: 1rem;" onclick="this.parentElement.parentElement.remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    } catch (error) {
        alert('Error fetching eligible students: ' + error.message);
    }
}
