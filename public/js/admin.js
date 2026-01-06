const API_URL = 'http://localhost:3000/api';

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
    loadScholarships();
    loadPrograms();
}

// API Helper
async function apiCall(endpoint, method = 'GET', body = null) {
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
}

// Load Scholarships
async function loadScholarships() {
    try {
        const data = await apiCall('/admin/scholarships');
        document.getElementById('total-scholarships').textContent = data.scholarships.length;
        displayScholarships(data.scholarships);
    } catch (error) {
        console.error('Error loading scholarships:', error);
    }
}

function displayScholarships(scholarships) {
    const container = document.getElementById('scholarships-list');
    
    if (scholarships.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No scholarships added yet.</p>';
        return;
    }
    
    container.innerHTML = scholarships.map(s => `
        <div class="card" style="margin-bottom: 1rem;">
            <h4>${s.title}</h4>
            <p><strong>Provider:</strong> ${s.provider}</p>
            <p>${s.description}</p>
            <p><strong>Amount:</strong> ${s.amount || 'N/A'} | <strong>Deadline:</strong> ${new Date(s.deadline).toLocaleDateString()}</p>
            <p><strong>Min CGPA:</strong> ${s.eligibility.minCGPA} | <strong>Gender:</strong> ${s.eligibility.gender.join(', ')}</p>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn btn-primary" onclick="viewEligibleStudents('${s._id}', 'scholarship')">View Eligible Students</button>
                <button class="btn btn-secondary" onclick="deleteScholarship('${s._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Load Programs
async function loadPrograms() {
    try {
        const data = await apiCall('/admin/programs');
        document.getElementById('total-programs').textContent = data.programs.length;
        displayPrograms(data.programs);
    } catch (error) {
        console.error('Error loading programs:', error);
    }
}

function displayPrograms(programs) {
    const container = document.getElementById('programs-list');
    
    if (programs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No programs added yet.</p>';
        return;
    }
    
    container.innerHTML = programs.map(p => `
        <div class="card" style="margin-bottom: 1rem;">
            <h4>${p.title}</h4>
            <p><strong>Provider:</strong> ${p.provider} | <strong>Type:</strong> ${p.type}</p>
            <p>${p.description}</p>
            <p><strong>Location:</strong> ${p.location || 'N/A'} | <strong>Duration:</strong> ${p.duration || 'N/A'}</p>
            <p><strong>Deadline:</strong> ${new Date(p.deadline).toLocaleDateString()}</p>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn btn-primary" onclick="viewEligibleStudents('${p._id}', 'program')">View Eligible Students</button>
                <button class="btn btn-secondary" onclick="deleteProgram('${p._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Show/Hide Forms
function showAddScholarshipForm() {
    document.getElementById('add-scholarship-form').style.display = 'block';
}

function hideAddScholarshipForm() {
    document.getElementById('add-scholarship-form').style.display = 'none';
    document.getElementById('scholarship-form').reset();
}

function showAddProgramForm() {
    document.getElementById('add-program-form').style.display = 'block';
}

function hideAddProgramForm() {
    document.getElementById('add-program-form').style.display = 'none';
    document.getElementById('program-form').reset();
}

// Add Scholarship
document.getElementById('scholarship-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        provider: formData.get('provider'),
        amount: formData.get('amount'),
        deadline: formData.get('deadline'),
        applicationLink: formData.get('applicationLink'),
        eligibility: {
            gender: formData.get('gender').split(',').map(s => s.trim()),
            minCGPA: parseFloat(formData.get('minCGPA')) || 0,
            year: formData.get('year') ? formData.get('year').split(',').map(n => parseInt(n.trim())) : [],
            departments: formData.get('departments') ? formData.get('departments').split(',').map(s => s.trim()) : [],
            requiredSkills: formData.get('requiredSkills') ? formData.get('requiredSkills').split(',').map(s => s.trim()) : []
        },
        tags: formData.get('tags') ? formData.get('tags').split(',').map(s => s.trim()) : []
    };
    
    try {
        await apiCall('/admin/scholarships', 'POST', data);
        alert('Scholarship added successfully!');
        hideAddScholarshipForm();
        loadScholarships();
    } catch (error) {
        alert('Error adding scholarship: ' + error.message);
    }
});

// Add Program
document.getElementById('program-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        provider: formData.get('provider'),
        type: formData.get('type'),
        duration: formData.get('duration'),
        deadline: formData.get('deadline'),
        location: formData.get('location'),
        applicationLink: formData.get('applicationLink'),
        eligibility: {
            gender: formData.get('gender').split(',').map(s => s.trim()),
            minCGPA: parseFloat(formData.get('minCGPA')) || 0,
            year: formData.get('year') ? formData.get('year').split(',').map(n => parseInt(n.trim())) : [],
            departments: formData.get('departments') ? formData.get('departments').split(',').map(s => s.trim()) : [],
            requiredSkills: formData.get('requiredSkills') ? formData.get('requiredSkills').split(',').map(s => s.trim()) : []
        },
        tags: formData.get('tags') ? formData.get('tags').split(',').map(s => s.trim()) : []
    };
    
    try {
        await apiCall('/admin/programs', 'POST', data);
        alert('Program added successfully!');
        hideAddProgramForm();
        loadPrograms();
    } catch (error) {
        alert('Error adding program: ' + error.message);
    }
});

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
