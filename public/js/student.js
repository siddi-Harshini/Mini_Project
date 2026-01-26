const API_URL = window.location.origin.replace(/\/$/, '') + '/api';

// Check authentication
function checkStudentAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'student') {
        window.location.href = 'login.html';
        return null;
    }
    
    return { token, user };
}

// Initialize
const auth = checkStudentAuth();
if (auth) {
    document.getElementById('student-name').textContent = auth.user.name;
    document.getElementById('student-welcome').textContent = auth.user.name;
    loadEligibleOpportunities();
}

// API Helper
async function apiCall(endpoint, method = 'GET', requireAuth = true) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (requireAuth) {
        options.headers['Authorization'] = `Bearer ${auth.token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'API call failed');
    }
    
    return data;
}

// Tab Switching
function switchTab(tab) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update content
    document.getElementById('my-matches-tab').style.display = tab === 'my-matches' ? 'block' : 'none';
    document.getElementById('all-opportunities-tab').style.display = tab === 'all-opportunities' ? 'block' : 'none';
    
    // Load data if needed
    if (tab === 'all-opportunities') {
        loadAllScholarships();
        loadAllPrograms();
    }
}

// Load Eligible Opportunities
async function loadEligibleOpportunities() {
    try {
        const [scholarships, programs] = await Promise.all([
            apiCall('/scholarships/eligible'),
            apiCall('/programs/eligible')
        ]);
        
        document.getElementById('eligible-count').textContent = scholarships.count + programs.count;
        
        // Count urgent deadlines (within 30 days)
        const urgentDate = new Date();
        urgentDate.setDate(urgentDate.getDate() + 30);
        const urgentScholarships = scholarships.scholarships.filter(s => new Date(s.deadline) <= urgentDate);
        const urgentPrograms = programs.programs.filter(p => new Date(p.deadline) <= urgentDate);
        document.getElementById('urgent-count').textContent = urgentScholarships.length + urgentPrograms.length;
        
        displayEligibleScholarships(scholarships.scholarships);
        displayEligiblePrograms(programs.programs);
    } catch (error) {
        console.error('Error loading eligible opportunities:', error);
    }
}

function displayEligibleScholarships(scholarships) {
    const container = document.getElementById('eligible-scholarships');
    
    if (scholarships.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: var(--bg-light); border-radius: 8px;">
                <p style="color: var(--text-light);">No matching scholarships found. Complete your profile to get better matches!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = scholarships.map(s => {
        const daysLeft = Math.ceil((new Date(s.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        const isUrgent = daysLeft <= 30;
        
        return `
            <div class="card" style="margin-bottom: 1rem; ${isUrgent ? 'border-left: 4px solid var(--danger-color);' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <h4>${s.title}</h4>
                        <p><strong>Provider:</strong> ${s.provider}</p>
                        <p>${s.description}</p>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                            ${s.tags.map(tag => `<span class="badge badge-primary">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        ${s.amount ? `<p style="font-size: 1.2rem; font-weight: bold; color: var(--success-color);">${s.amount}</p>` : ''}
                        <p style="font-weight: bold; color: ${isUrgent ? 'var(--danger-color)' : 'var(--primary-color)'};">
                            ${isUrgent ? '⚠️ ' : ''}${daysLeft} days left
                        </p>
                    </div>
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                    <p><strong>Deadline:</strong> ${new Date(s.deadline).toLocaleDateString()}</p>
                    ${s.applicationLink ? `<a href="${s.applicationLink}" target="_blank" class="btn btn-primary" style="margin-top: 0.5rem;">Apply Now →</a>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function displayEligiblePrograms(programs) {
    const container = document.getElementById('eligible-programs');
    
    if (programs.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: var(--bg-light); border-radius: 8px;">
                <p style="color: var(--text-light);">No matching programs found. Complete your profile to get better matches!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = programs.map(p => {
        const daysLeft = Math.ceil((new Date(p.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        const isUrgent = daysLeft <= 30;
        
        return `
            <div class="card" style="margin-bottom: 1rem; ${isUrgent ? 'border-left: 4px solid var(--danger-color);' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <h4>${p.title}</h4>
                        <p><strong>Provider:</strong> ${p.provider} | <strong>Type:</strong> ${p.type}</p>
                        <p>${p.description}</p>
                        <p><strong>Duration:</strong> ${p.duration || 'N/A'} | <strong>Location:</strong> ${p.location || 'N/A'}</p>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                            ${p.tags.map(tag => `<span class="badge badge-primary">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <span class="badge badge-success">${p.type}</span>
                        <p style="font-weight: bold; color: ${isUrgent ? 'var(--danger-color)' : 'var(--primary-color)'}; margin-top: 0.5rem;">
                            ${isUrgent ? '⚠️ ' : ''}${daysLeft} days left
                        </p>
                    </div>
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                    <p><strong>Deadline:</strong> ${new Date(p.deadline).toLocaleDateString()}</p>
                    ${p.applicationLink ? `<a href="${p.applicationLink}" target="_blank" class="btn btn-primary" style="margin-top: 0.5rem;">Apply Now →</a>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Load All Scholarships
async function loadAllScholarships() {
    const sort = document.getElementById('scholarship-sort')?.value || 'newest';
    const endpoint = sort === 'deadline' ? '/scholarships/by-deadline' : '/scholarships';
    
    try {
        const data = await apiCall(endpoint, 'GET', false);
        document.getElementById('total-count').textContent = data.count;
        displayAllScholarships(data.scholarships);
    } catch (error) {
        console.error('Error loading scholarships:', error);
    }
}

function displayAllScholarships(scholarships) {
    const container = document.getElementById('all-scholarships');
    
    if (scholarships.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No scholarships available.</p>';
        return;
    }
    
    container.innerHTML = scholarships.map(s => `
        <div class="card" style="margin-bottom: 1rem;">
            <h4>${s.title}</h4>
            <p><strong>Provider:</strong> ${s.provider}</p>
            <p>${s.description}</p>
            <p><strong>Amount:</strong> ${s.amount || 'N/A'} | <strong>Deadline:</strong> ${new Date(s.deadline).toLocaleDateString()}</p>
            ${s.applicationLink ? `<a href="${s.applicationLink}" target="_blank" class="btn btn-primary" style="margin-top: 0.5rem;">View Details →</a>` : ''}
        </div>
    `).join('');
}

// Load All Programs
async function loadAllPrograms() {
    const sort = document.getElementById('program-sort')?.value || 'newest';
    const type = document.getElementById('program-filter')?.value || '';
    
    let endpoint = sort === 'deadline' ? '/programs/by-deadline' : '/programs';
    if (type) {
        endpoint += `?type=${type}`;
    }
    
    try {
        const data = await apiCall(endpoint, 'GET', false);
        displayAllPrograms(data.programs);
    } catch (error) {
        console.error('Error loading programs:', error);
    }
}

function displayAllPrograms(programs) {
    const container = document.getElementById('all-programs');
    
    if (programs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No programs available.</p>';
        return;
    }
    
    container.innerHTML = programs.map(p => `
        <div class="card" style="margin-bottom: 1rem;">
            <h4>${p.title}</h4>
            <p><strong>Provider:</strong> ${p.provider} | <strong>Type:</strong> ${p.type}</p>
            <p>${p.description}</p>
            <p><strong>Duration:</strong> ${p.duration || 'N/A'} | <strong>Location:</strong> ${p.location || 'N/A'}</p>
            <p><strong>Deadline:</strong> ${new Date(p.deadline).toLocaleDateString()}</p>
            ${p.applicationLink ? `<a href="${p.applicationLink}" target="_blank" class="btn btn-primary" style="margin-top: 0.5rem;">View Details →</a>` : ''}
        </div>
    `).join('');
}

// CSS for tabs
const style = document.createElement('style');
style.textContent = `
    .tab-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        background: none;
        cursor: pointer;
        font-weight: 600;
        color: var(--text-light);
        border-bottom: 3px solid transparent;
        transition: all 0.3s;
    }
    
    .tab-btn:hover {
        color: var(--primary-color);
    }
    
    .tab-btn.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
    }
`;
document.head.appendChild(style);
