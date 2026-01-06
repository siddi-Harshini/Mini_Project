const API_URL = 'http://localhost:3000/api';

// Check if user is already logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user.role) {
        // Redirect to appropriate dashboard
        if (user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'student-dashboard.html';
        }
    }
}

// Login Form Handler
if (document.getElementById('login-form')) {
    // Check auth on page load
    checkAuth();
    
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        const errorDiv = document.getElementById('error-message');
        const successDiv = document.getElementById('success-message');
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Check if role matches
                if (data.user.role !== role) {
                    errorDiv.textContent = `This account is registered as ${data.user.role}, not ${role}`;
                    errorDiv.style.display = 'block';
                    successDiv.style.display = 'none';
                    return;
                }
                
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                successDiv.textContent = 'Login successful! Redirecting...';
                successDiv.style.display = 'block';
                errorDiv.style.display = 'none';
                
                // Redirect based on role
                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        window.location.href = 'student-dashboard.html';
                    }
                }, 1000);
            } else {
                errorDiv.textContent = data.message || 'Login failed';
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
            }
        } catch (error) {
            errorDiv.textContent = 'Network error. Please try again.';
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
        }
    });
}

// Register Form Handler
if (document.getElementById('register-form')) {
    // Toggle student profile fields based on role
    document.getElementById('role').addEventListener('change', (e) => {
        const studentProfile = document.getElementById('student-profile');
        if (e.target.value === 'student') {
            studentProfile.style.display = 'block';
        } else {
            studentProfile.style.display = 'none';
        }
    });
    
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        const errorDiv = document.getElementById('error-message');
        const successDiv = document.getElementById('success-message');
        
        // Build profile object if student
        let profile = {};
        if (role === 'student') {
            const skills = document.getElementById('skills').value
                .split(',')
                .map(s => s.trim())
                .filter(s => s);
            
            const interests = document.getElementById('interests').value
                .split(',')
                .map(i => i.trim())
                .filter(i => i);
            
            profile = {
                gender: document.getElementById('gender').value,
                year: parseInt(document.getElementById('year').value) || undefined,
                department: document.getElementById('department').value,
                cgpa: parseFloat(document.getElementById('cgpa').value) || undefined,
                skills: skills,
                interests: interests,
                location: document.getElementById('location').value,
                graduationYear: parseInt(document.getElementById('graduationYear').value) || undefined
            };
        }
        
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, role, profile })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                successDiv.textContent = 'Registration successful! Redirecting...';
                successDiv.style.display = 'block';
                errorDiv.style.display = 'none';
                
                // Redirect based on role
                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        window.location.href = 'student-dashboard.html';
                    }
                }, 1500);
            } else {
                errorDiv.textContent = data.message || 'Registration failed';
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
            }
        } catch (error) {
            console.error('Registration error:', error);
            errorDiv.textContent = 'Network error. Please try again.';
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
        }
    });
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}
